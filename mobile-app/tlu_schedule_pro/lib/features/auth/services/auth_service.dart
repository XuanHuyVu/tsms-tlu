import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import '../../../shared/models/user_entity.dart';

class AuthService {
  /// Dùng 10.0.2.2 cho Android emulator, localhost cho web
  static String get baseUrl => kIsWeb ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

  /// Đăng nhập -> trả về UserEntity (token + user)
  static Future<UserEntity> login(String username, String password) async {
    final uri = Uri.parse('$baseUrl/api/auth/login');

    try {
      final response = await http
          .post(
        uri,
        headers: const {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      )
          .timeout(const Duration(seconds: 12));

      if (kDebugMode) {
        // Debug log
        print('POST $uri => ${response.statusCode}');
        print('Body: ${response.body}');
      }

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return UserEntity.fromJson(data);
      }

      // Lỗi có message từ server?
      String message = 'Login failed (${response.statusCode})';
      try {
        final err = jsonDecode(response.body);
        if (err is Map && err['message'] != null) {
          message = err['message'].toString();
        }
      } catch (_) {}
      throw Exception(message);
    } on TimeoutException {
      throw Exception('Không thể kết nối máy chủ. Vui lòng thử lại.');
    } catch (e) {
      throw Exception('Đăng nhập lỗi: $e');
    }
  }
}
