import 'package:flutter/material.dart';
import '../models/UserEntity.dart';
import '../services/AuthService.dart';

class AuthViewModel extends ChangeNotifier {
  UserEntity? _user;
  bool get isLoggedIn => _user != null;
  UserEntity? get user => _user;

  Future<void> login(String username, String password) async {
    try {
      _user = await AuthService.login(username, password);
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}
