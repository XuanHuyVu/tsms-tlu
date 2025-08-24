import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/teacher_notification_model.dart';

class TeacherNotificationService {
  static const String baseUrl = "http://localhost:8080/api/teacher/notifications";

  // GET danh sách thông báo
  static Future<List<TeacherNotification>> fetchNotifications() async {
    final res = await http.get(Uri.parse(baseUrl));
    if (res.statusCode == 200) {
      final List<dynamic> body = json.decode(res.body);
      return body.map((e) => TeacherNotification.fromJson(e)).toList();
    } else {
      throw Exception("Failed to load notifications");
    }
  }

  // PUT đánh dấu đã đọc
  static Future<void> markAsRead(int id) async {
    final res = await http.put(Uri.parse("$baseUrl/read/$id"));
    if (res.statusCode != 200) {
      throw Exception("Failed to mark notification as read");
    }
  }
}
