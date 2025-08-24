import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

/* ================== Model ================== */
class TeacherNotification {
  final int id;
  final String title;
  final String content;
  final String type;
  final int relatedScheduleChangeId;
  final DateTime createdAt;
  final DateTime updatedAt;
  bool isRead;

  TeacherNotification({
    required this.id,
    required this.title,
    required this.content,
    required this.type,
    required this.relatedScheduleChangeId,
    required this.createdAt,
    required this.updatedAt,
    required this.isRead,
  });

  factory TeacherNotification.fromJson(Map<String, dynamic> json) {
    return TeacherNotification(
      id: json['id'],
      title: json['title'],
      content: json['content'],
      type: json['type'],
      relatedScheduleChangeId: json['relatedScheduleChangeId'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      isRead: json['isRead'],
    );
  }
}

/* ================== Service ================== */
class NotificationService {
  static const String baseUrl = "http://localhost:8080/api/teacher/notifications";

  static Future<List<TeacherNotification>> fetchNotifications() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((e) => TeacherNotification.fromJson(e)).toList();
    } else {
      throw Exception("Failed to load notifications");
    }
  }

  static Future<void> markAsRead(int id) async {
    await http.put(Uri.parse("$baseUrl/read/$id"));
  }

  static Future<void> markAsUnread(int id) async {
    await http.put(Uri.parse("$baseUrl/unread/$id"));
  }

  static Future<void> deleteNotification(int id) async {
    await http.delete(Uri.parse("$baseUrl/$id"));
  }
}

/* ================== UI ================== */
class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  _NotificationScreenState createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  late Future<List<TeacherNotification>> _notificationsFuture;

  @override
  void initState() {
    super.initState();
    _notificationsFuture = NotificationService.fetchNotifications();
  }

  void _refresh() {
    setState(() {
      _notificationsFuture = NotificationService.fetchNotifications();
    });
  }

  void _handleMenuAction(String action, TeacherNotification notif) async {
    if (action == "markUnread") {
      await NotificationService.markAsUnread(notif.id);
    } else if (action == "delete") {
      await NotificationService.deleteNotification(notif.id);
    }
    _refresh();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Thông báo"),
      ),
      body: FutureBuilder<List<TeacherNotification>>(
        future: _notificationsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return const Center(child: Text("Lỗi tải thông báo"));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text("Không có thông báo nào"));
          }

          final notifications = snapshot.data!;
          return ListView.builder(
            itemCount: notifications.length,
            itemBuilder: (context, index) {
              final notif = notifications[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                child: ListTile(
                  leading: Icon(
                    notif.isRead ? Icons.mark_email_read : Icons.mark_email_unread,
                    color: notif.isRead ? Colors.grey : Colors.blue,
                  ),
                  title: Text(notif.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(notif.content),
                  trailing: PopupMenuButton<String>(
                    onSelected: (value) => _handleMenuAction(value, notif),
                    itemBuilder: (context) => [
                      if (notif.isRead)
                        const PopupMenuItem(
                          value: "markUnread",
                          child: Text("Đánh dấu chưa đọc"),
                        ),
                      const PopupMenuItem(
                        value: "delete",
                        child: Text("Xóa thông báo"),
                      ),
                      const PopupMenuItem(
                        value: "cancel",
                        child: Text("Hủy"),
                      ),
                    ],
                  ),
                  onTap: () async {
                    await NotificationService.markAsRead(notif.id);
                    _refresh();
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}
