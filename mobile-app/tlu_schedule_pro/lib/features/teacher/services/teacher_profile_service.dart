// lib/features/teacher/services/teacher_profile_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/teacher_profile_model.dart';

class TeacherProfileService {
  static const String baseUrl = "http://10.0.2.2:8080/api/teacher";
  // 10.0.2.2 = localhost cho Android Emulator

  Future<TeacherProfile> getProfile(int teacherId) async {
    final response = await http.get(
      Uri.parse("$baseUrl/$teacherId"),
      headers: {"Accept": "application/json"},
    );

    if (response.statusCode == 200) {
      return TeacherProfile.fromJson(jsonDecode(response.body));
    } else {
      throw Exception("Failed to load teacher profile");
    }
  }

  Future<TeacherProfile> updateProfile(TeacherProfile profile) async {
    final response = await http.put(
      Uri.parse("$baseUrl/${profile.id}"),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: jsonEncode(profile.toJson()),
    );

    if (response.statusCode == 200) {
      return TeacherProfile.fromJson(jsonDecode(response.body));
    } else {
      throw Exception("Failed to update teacher profile");
    }
  }
}
