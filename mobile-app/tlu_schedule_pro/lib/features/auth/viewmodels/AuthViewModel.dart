import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../shared/models/UserEntity.dart';
import '../services/AuthService.dart';

class AuthViewModel extends ChangeNotifier {
  UserEntity? _user;

  bool get isLoggedIn => _user != null;
  UserEntity? get user => _user;

  bool get isTeacher => _user?.role == 'ROLE_GIANGVIEN';
  bool get isStudent => _user?.role == 'ROLE_SINHVIEN';

  Future<void> login(String username, String password) async {
    try {
      final u = await AuthService.login(username, password);
      _user = u;

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('jwt_token', u.token);
      await prefs.setString('username', u.username);
      await prefs.setString('role', u.role);

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

    if (token != null && username != null && role != null && role.isNotEmpty) {
      _user = UserEntity(username: username, token: token, role: role);
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
    notifyListeners();
  }
}
