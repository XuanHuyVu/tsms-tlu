import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tlu_schedule_pro/features/teacher/models/teacher_notification_model.dart';

class TeacherNotificationService {
  String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:8080';
    } else {
      return 'http://10.0.2.2:8080';
    }
  }

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  Future<List<TeacherNotification>> fetchNotifications() async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Không tìm thấy token. Vui lòng đăng nhập lại.');
    }

    final uri = Uri.parse('$baseUrl/api/teacher/notifications');
    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(utf8.decode(response.bodyBytes));
      return jsonList
          .map((json) => TeacherNotification.fromJson(json))
          .toList();
    } else {
      throw Exception(
          'Lỗi tải thông báo: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> markAsRead(int notificationId) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Không tìm thấy token. Vui lòng đăng nhập lại.');
    }

    final uri =
    Uri.parse('$baseUrl/api/teacher/notifications/read/$notificationId');
    final response = await http.put(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception(
          'Đánh dấu đã đọc thất bại: ${response.statusCode} - ${response.body}');
    }
  }
}
