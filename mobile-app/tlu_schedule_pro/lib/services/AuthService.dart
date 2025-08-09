import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/UserEntity.dart';

class AuthService {
  static Future<UserEntity> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('https://your-api.com/api/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return UserEntity.fromJson(data);
    } else {
      throw Exception('Login failed');
    }
  }
}
