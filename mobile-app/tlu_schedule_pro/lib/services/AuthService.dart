import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/UserEntity.dart';

class AuthService {
  static Future<UserEntity> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('http://10.0.2.2:8080/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    if (kDebugMode) {
      print('Status code: ${response.statusCode}');
    }
    if (kDebugMode) {
      print('Body: ${response.body}');
    }



    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return UserEntity.fromJson(data);
    } else {
      throw Exception('Login failed');
    }
  }
}
