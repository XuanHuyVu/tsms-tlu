// lib/features/teacher/models/teacher_profile_model.dart
class TeacherProfile {
  final int id;
  final String name;
  final String email;
  final String phone;
  final String department;
  final String faculty;
  final String avatarUrl;

  TeacherProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.department,
    required this.faculty,
    required this.avatarUrl,
  });

  factory TeacherProfile.fromJson(Map<String, dynamic> json) {
    return TeacherProfile(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      department: json['department'] ?? '',
      faculty: json['faculty'] ?? '',
      avatarUrl: json['avatarUrl'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "name": name,
      "email": email,
      "phone": phone,
      "department": department,
      "faculty": faculty,
      "avatarUrl": avatarUrl,
    };
  }
}
