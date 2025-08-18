// lib/shared/models/UserEntity.dart
class UserEntity {
  final String username;
  final String token;
  final String role;
  final int? teacherId;
  final int? studentId;
  final String? fullName;

  UserEntity({
    required this.username,
    required this.token,
    required this.role,
    this.teacherId,
    this.studentId,
    this.fullName,
  });

  /// Kỳ vọng JSON login giống postman:
  /// {
  ///   "token": "...",
  ///   "user": {
  ///     "id": 13, "username": "gvthang",
  ///     "role": "ROLE_TEACHER", "teacherId": 1, "studentId": null, "fullName": "Nguyễn Văn A"
  ///   }
  /// }
  factory UserEntity.fromJson(Map<String, dynamic> json) {
    final user = (json['user'] ?? {}) as Map<String, dynamic>;
    int? _toInt(dynamic v) {
      if (v == null) return null;
      if (v is int) return v;
      return int.tryParse('$v');
    }

    return UserEntity(
      username: (user['username'] ?? '').toString(),
      token: (json['token'] ?? '').toString(),
      role: (user['role'] ?? '').toString(),
      teacherId: _toInt(user['teacherId']),
      studentId: _toInt(user['studentId']),
      fullName: user['fullName']?.toString(),
    );
  }
}
