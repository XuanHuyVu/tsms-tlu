import 'dart:convert';
import 'package:http/http.dart' as http;

class TeacherNotification {
  final int id;
  final String title;
  final String content;
  final String type;
  final int relatedScheduleChangeId;
  final String createdAt;
  final bool isRead;

  TeacherNotification({
    required this.id,
    required this.title,
    required this.content,
    required this.type,
    required this.relatedScheduleChangeId,
    required this.createdAt,
    required this.isRead,
  });

  factory TeacherNotification.fromJson(Map<String, dynamic> json) {
    return TeacherNotification(
      id: json['id'],
      title: json['title'],
      content: json['content'],
      type: json['type'],
      relatedScheduleChangeId: json['relatedScheduleChangeId'],
      createdAt: json['createdAt'],
      isRead: json['isRead'],
    );
  }
}

class NotificationService {
  static const String baseUrl = "http://localhost:8080/api/teacher/notifications";

  /// Lấy danh sách thông báo
  static Future<List<TeacherNotification>> fetchNotifications() async {
    final res = await http.get(Uri.parse(baseUrl));
    if (res.statusCode == 200) {
      final List<dynamic> data = jsonDecode(res.body);
      return data.map((e) => TeacherNotification.fromJson(e)).toList();
    } else {
      throw Exception("Failed to load notifications: ${res.statusCode}");
    }
  }

  /// Đánh dấu đã đọc
  static Future<void> markAsRead(int id) async {
    final res = await http.put(Uri.parse("$baseUrl/read/$id"));
    if (res.statusCode != 200) {
      throw Exception("Failed to mark notification as read");
    }
  }
}
