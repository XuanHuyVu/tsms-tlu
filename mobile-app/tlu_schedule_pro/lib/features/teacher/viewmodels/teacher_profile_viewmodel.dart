// lib/features/teacher/viewmodels/teacher_profile_viewmodel.dart
import 'package:flutter/material.dart';
import '../models/teacher_profile_model.dart';
import '../services/teacher_profile_service.dart';

class TeacherProfileViewModel extends ChangeNotifier {
  final TeacherProfileService _service = TeacherProfileService();
  TeacherProfile? _profile;
  bool _isLoading = false;
  String? _errorMessage;

  TeacherProfile? get profile => _profile;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchProfile(int teacherId) async {
    _isLoading = true;
    notifyListeners();

    try {
      _profile = await _service.getProfile(teacherId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> updateProfile(TeacherProfile updated) async {
    _isLoading = true;
    notifyListeners();

    try {
      _profile = await _service.updateProfile(updated);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }
}
