import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../shared/models/UserEntity.dart';
import '../services/AuthService.dart';

class AuthViewModel extends ChangeNotifier {
  UserEntity? _user;

  bool get isLoggedIn => _user != null;
  UserEntity? get user => _user;

  // Hỗ trợ cả tên role VN/EN để tránh lệch môi trường
  bool get isTeacher =>
      _user?.role == 'ROLE_TEACHER' || _user?.role == 'ROLE_GIANGVIEN';
  bool get isStudent =>
      _user?.role == 'ROLE_STUDENT' || _user?.role == 'ROLE_SINHVIEN';

  Future<void> login(String username, String password) async {
    try {
      final u = await AuthService.login(username, password); // trả về UserEntity.fromJson
      _user = u;

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('jwt_token', u.token);
      await prefs.setString('username', u.username);
      await prefs.setString('role', u.role);

      // các trường bổ sung từ response login
      await prefs.setInt('user_id', u.id);
      if (u.teacherId != null) {
        await prefs.setInt('teacher_id', u.teacherId!);
      } else {
        await prefs.remove('teacher_id');
      }
      if (u.studentId != null) {
        await prefs.setInt('student_id', u.studentId!);
      } else {
        await prefs.remove('student_id');
      }
      if (u.fullName != null) {
        await prefs.setString('full_name', u.fullName!);
      } else {
        await prefs.remove('full_name');
      }

      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> loadUserFromStorage() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token');
    final username = prefs.getString('username');
    final role = prefs.getString('role');
    final userId = prefs.getInt('user_id');
    final teacherId = prefs.getInt('teacher_id');
    final studentId = prefs.getInt('student_id');
    final fullName = prefs.getString('full_name');

    if (token != null && username != null && role != null && userId != null) {
      _user = UserEntity(
        username: username,
        token: token,
        role: role,
        id: userId,
        teacherId: teacherId,
        studentId: studentId,
        fullName: fullName,
      );
    } else {
      _user = null;
    }
    notifyListeners();
  }

  Future<void> logout() async {
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    await prefs.remove('username');
    await prefs.remove('role');
    await prefs.remove('user_id');
    await prefs.remove('teacher_id');
    await prefs.remove('student_id');
    await prefs.remove('full_name');
    notifyListeners();
  }
}
