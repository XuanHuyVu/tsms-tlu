import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/ProfileEntity.dart';

class ProfileService {
  Future<ProfileEntity> fetchProfile() async {
    final uri = Uri.parse('http://192.168.0.101:8080/api/admin/students');

    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        // Nếu cần token:
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
