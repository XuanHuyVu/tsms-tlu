import 'package:flutter/material.dart';
import '../models/teacher_profile_model.dart';
import '../services/teacher_profile_service.dart';

class TeacherProfileViewModel extends ChangeNotifier {
  final TeacherProfileService _service = TeacherProfileService();
  TeacherProfile? teacherProfile;
  bool isLoading = false;

  Future<void> getTeacherProfile(String token) async {
    isLoading = true;
    notifyListeners();

    teacherProfile = await _service.fetchTeacherProfile(token);

    isLoading = false;
    notifyListeners();
  }
}
