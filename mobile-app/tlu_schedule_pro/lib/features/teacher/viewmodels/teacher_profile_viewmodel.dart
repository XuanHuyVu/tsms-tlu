import 'dart:developer' as dev;
import 'package:flutter/material.dart';

import '../models/teacher_profile_model.dart';
import '../services/teacher_profile_service.dart';

class TeacherProfileViewModel extends ChangeNotifier {
  final _service = TeacherProfileService();

  bool isLoading = false;
  String? errorMessage;
  TeacherProfile? profile;

  Future<void> fetchProfile(int teacherId) async {
    if (teacherId <= 0) {
      errorMessage = 'teacherId không hợp lệ: $teacherId';
      profile = null;
      notifyListeners();
      return;
    }

    isLoading = true;
    errorMessage = null;
    profile = null;
    notifyListeners();

    try {
      dev.log('TeacherProfileVM.fetchProfile(id=$teacherId)');
      profile = await _service.getProfile(teacherId);              // endpoint chính
      dev.log('TeacherProfileVM -> OK: ${profile}');
    } catch (e) {
      dev.log('getProfile(id=$teacherId) FAIL: $e');

      // Fallback: nếu backend dùng userId thay vì teacherId.
      try {
        dev.log('Fallback getProfileByUserId(userId=$teacherId)');
        profile = await _service.getProfileByUserId(teacherId);
      } catch (e2) {
        dev.log('Fallback FAIL: $e2');
        errorMessage = e2.toString();
      }
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
