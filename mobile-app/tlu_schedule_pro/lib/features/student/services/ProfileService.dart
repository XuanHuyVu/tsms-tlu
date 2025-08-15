import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/ProfileEntity.dart';

class ProfileService {
  String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:8080';
    } else {
      return 'http://10.0.2.2:8080';
    }
  }

  Future<ProfileEntity> fetchProfile() async {
    final uri = Uri.parse('$baseUrl/api/admin/students');

    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      if (jsonList.isNotEmpty) {
        return ProfileEntity.fromJson(jsonList[0]);
      } else {
        throw Exception("Không có dữ liệu profile");
      }
    } else {
      throw Exception('Lỗi tải profile: ${response.statusCode} - ${response.body}');
    }
  }
}
