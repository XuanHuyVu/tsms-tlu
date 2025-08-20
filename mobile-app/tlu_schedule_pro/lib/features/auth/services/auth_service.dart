import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../../shared/models/user_entity.dart';

class AuthService {
  /// Base URL configuration
  static String get baseUrl => kIsWeb ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

  /// Login and return UserEntity
  static Future<UserEntity> login(String username, String password) async {
    final uri = Uri.parse('$baseUrl/api/auth/login');

    if (kDebugMode) {
      print('🔐 Attempting login to: $uri');
      print('👤 Username: $username');
    }

    try {
      final response = await http.post(
        uri,
        headers: const {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      ).timeout(const Duration(seconds: 15));

      // Debug response
      if (kDebugMode) {
        print('📨 Response status: ${response.statusCode}');
        print('📦 Response body: ${response.body}');
        print('📋 Response headers: ${response.headers}');
      }

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final user = UserEntity.fromJson(data);

        // Save to SharedPreferences with detailed debug
        final prefs = await SharedPreferences.getInstance();

        // Clear any existing data first
        await prefs.clear();

        // Save new data
        await prefs.setString('token', user.token);
        await prefs.setString('username', user.username);
        await prefs.setString('role', user.role);
        await prefs.setInt('id', user.id);

        if (user.teacherId != null) {
          await prefs.setInt('teacherId', user.teacherId!);
        }
        if (user.studentId != null) {
          await prefs.setInt('studentId', user.studentId!);
        }
        if (user.fullName != null) {
          await prefs.setString('fullName', user.fullName!);
        }

        // Verify saved data
        if (kDebugMode) {
          print('✅ LOGIN SUCCESSFUL');
          print('🔑 Token received: ${user.token}');
          print('🔑 Token length: ${user.token.length}');
          print('💾 Token saved to SharedPreferences: ${prefs.getString('token')}');
          print('👤 User details saved:');
          print('   - username: ${prefs.getString('username')}');
          print('   - role: ${prefs.getString('role')}');
          print('   - id: ${prefs.getInt('id')}');
          print('   - teacherId: ${prefs.getInt('teacherId')}');
          print('   - studentId: ${prefs.getInt('studentId')}');
          print('   - fullName: ${prefs.getString('fullName')}');

          // Verify token match
          final savedToken = prefs.getString('token');
          if (savedToken == user.token) {
            print('✅ Token verification: MATCHED');
          } else {
            print('❌ Token verification: MISMATCH');
            print('   Original: ${user.token}');
            print('   Saved: $savedToken');
          }
        }

        return user;
      } else {
        // Handle error responses
        String errorMessage = 'Login failed (${response.statusCode})';
        try {
          final errorData = jsonDecode(response.body);
          if (errorData is Map<String, dynamic>) {
            errorMessage = errorData['message']?.toString() ?? errorMessage;
            if (errorData.containsKey('error')) {
              errorMessage += ' - ${errorData['error']}';
            }
          }
        } catch (e) {
          if (kDebugMode) {
            print('⚠️ Error parsing error response: $e');
          }
        }

        throw Exception(errorMessage);
      }
    } on TimeoutException {
      throw Exception('Connection timeout. Please check your network and try again.');
    } on http.ClientException catch (e) {
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      if (kDebugMode) {
        print('❌ Unexpected login error: $e');
      }
      throw Exception('Login failed: ${e.toString()}');
    }
  }

  /// Get token from local storage with debug
  static Future<String?> getToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (kDebugMode) {
        print('🔍 Retrieving token from SharedPreferences:');
        print('   - Token exists: ${token != null}');
        print('   - Token length: ${token?.length ?? 0}');
        if (token != null) {
          print('   - Token first 20 chars: ${token.substring(0, token.length > 20 ? 20 : token.length)}...');
        }

        // Print all keys for debugging
        final allKeys = prefs.getKeys();
        print('   - All SharedPreferences keys: $allKeys');
      }

      return token;
    } catch (e) {
      if (kDebugMode) {
        print('❌ Error getting token: $e');
      }
      return null;
    }
  }

  /// Get current user with detailed debug
  static Future<UserEntity?> getCurrentUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      if (kDebugMode) {
        print('🔍 Retrieving current user from SharedPreferences:');
        final allKeys = prefs.getKeys();
        print('   - Available keys: $allKeys');

        for (var key in allKeys) {
          final value = prefs.get(key);
          print('     $key: $value (${value.runtimeType})');
        }
      }

      final token = prefs.getString('token');
      final username = prefs.getString('username');
      final role = prefs.getString('role');
      final id = prefs.getInt('id');
      final teacherId = prefs.getInt('teacherId');
      final studentId = prefs.getInt('studentId');
      final fullName = prefs.getString('fullName');

      if (token == null || username == null || role == null || id == null) {
        if (kDebugMode) {
          print('❌ Incomplete user data in SharedPreferences');
          print('   - token: $token');
          print('   - username: $username');
          print('   - role: $role');
          print('   - id: $id');
        }
        return null;
      }

      final user = UserEntity(
        username: username,
        token: token,
        role: role,
        id: id,
        teacherId: teacherId,
        studentId: studentId,
        fullName: fullName,
      );

      if (kDebugMode) {
        print('✅ Current user retrieved successfully');
        print('👤 User details:');
        print('   - username: ${user.username}');
        print('   - role: ${user.role}');
        print('   - id: ${user.id}');
        print('   - teacherId: ${user.teacherId}');
        print('   - studentId: ${user.studentId}');
        print('   - fullName: ${user.fullName}');
        print('   - token length: ${user.token.length}');
      }

      return user;
    } catch (e) {
      if (kDebugMode) {
        print('❌ Error getting current user: $e');
      }
      return null;
    }
  }

  /// Logout with debug
  static Future<void> logout() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      if (kDebugMode) {
        print('🚪 Logging out - Clearing SharedPreferences');
        print('   - Current token: ${prefs.getString('token')}');
      }

      await prefs.clear();

      if (kDebugMode) {
        print('✅ Logout successful - SharedPreferences cleared');
        print('   - Token after clear: ${prefs.getString('token')}');
      }
    } catch (e) {
      if (kDebugMode) {
        print('❌ Error during logout: $e');
      }
      rethrow;
    }
  }

  /// Additional method to verify token consistency
  static Future<bool> verifyTokenConsistency() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedToken = prefs.getString('token');
      final currentUser = await getCurrentUser();

      final isConsistent = savedToken == currentUser?.token;

      if (kDebugMode) {
        print('🔍 Token consistency check:');
        print('   - Saved token: $savedToken');
        print('   - User token: ${currentUser?.token}');
        print('   - Consistent: $isConsistent');
      }

      return isConsistent;
    } catch (e) {
      if (kDebugMode) {
        print('❌ Error verifying token consistency: $e');
      }
      return false;
    }
  }
}