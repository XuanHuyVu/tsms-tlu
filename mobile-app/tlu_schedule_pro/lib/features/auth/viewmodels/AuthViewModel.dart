import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../shared/models/UserEntity.dart';
import '../services/AuthService.dart';

class AuthViewModel extends ChangeNotifier {
  UserEntity? _user;
  bool get isLoggedIn => _user != null;
  UserEntity? get user => _user;

  Future<void> login(String username, String password) async {
    try {
      _user = await AuthService.login(username, password);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('jwt_token', _user!.token);
      await prefs.setString('username', _user!.username);

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

    if (token != null && username != null && role != null) {
      _user = UserEntity(username: username, token: token, role: role);
      notifyListeners();
    }

  }

  Future<void> logout() async {
    _user = null;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    await prefs.remove('username');

    notifyListeners();
  }
}
