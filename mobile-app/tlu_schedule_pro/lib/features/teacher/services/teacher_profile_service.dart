import 'dart:convert';
import 'package:http/http.dart' as http;

import '../models/teacher_profile_model.dart';

class TeacherProfileService {
  final http.Client _client;
  TeacherProfileService({http.Client? client}) : _client = client ?? http.Client();

  // TODO: sửa lại base URL cho đúng backend của bạn
  static const String _base =
  String.fromEnvironment('API_BASE', defaultValue: 'https://YOUR_HOST/api');

  // Lấy hồ sơ theo teacherId: GET /admin/teachers/{id}
  Future<TeacherProfile> getProfile(int teacherId) async {
    final uri = Uri.parse('$_base/admin/teachers/$teacherId');
    final res = await _client.get(uri, headers: await _headers());
    if (res.statusCode != 200) {
      throw Exception('Failed to load teacher profile (${res.statusCode}): ${res.body}');
    }
    final decoded = jsonDecode(res.body);
    final data = (decoded is Map && decoded['data'] != null) ? decoded['data'] : decoded;
    return TeacherProfile.fromJson(data as Map<String, dynamic>);
  }

  // Fallback: có backend yêu cầu userId thay vì teacherId
  // GET /admin/teachers?userId={id}
  Future<TeacherProfile> getProfileByUserId(int userId) async {
    final uri = Uri.parse('$_base/admin/teachers?userId=$userId');
    final res = await _client.get(uri, headers: await _headers());
    if (res.statusCode != 200) {
      throw Exception(
        'Failed to load teacher profile by userId (${res.statusCode}): ${res.body}',
      );
    }
    final decoded = jsonDecode(res.body);
    dynamic data = (decoded is Map && decoded['data'] != null) ? decoded['data'] : decoded;
    if (data is List && data.isNotEmpty) data = data.first; // nhiều API trả mảng
    return TeacherProfile.fromJson(data as Map<String, dynamic>);
  }

  static Future<Map<String, String>> _headers() async {
    // TODO: thêm Authorization nếu backend yêu cầu
    return {'Content-Type': 'application/json'};
  }
}
