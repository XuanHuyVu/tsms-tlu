import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/teacher_profile_model.dart';

class TeacherProfileService {
  final String baseUrl = "http://localhost:8080/api/teacher/profile";

  Future<TeacherProfile?> fetchTeacherProfile(String token) async {
    final response = await http.get(
      Uri.parse(baseUrl),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return TeacherProfile.fromJson(jsonDecode(response.body));
    } else {
      return null;
    }
  }
}
