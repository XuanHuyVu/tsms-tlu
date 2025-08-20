class TeacherProfile {
  final String teacherCode;
  final String fullName;
  final String gender;
  final String email;
  final String dateOfBirth;
  final String phoneNumber;
  final String departmentName;
  final String facultyName;
  final String status;

  TeacherProfile({
    required this.teacherCode,
    required this.fullName,
    required this.gender,
    required this.email,
    required this.dateOfBirth,
    required this.phoneNumber,
    required this.departmentName,
    required this.facultyName,
    required this.status,
  });

  factory TeacherProfile.fromJson(Map<String, dynamic> json) {
    return TeacherProfile(
      teacherCode: json['teacherCode'] ?? '',
      fullName: json['fullName'] ?? '',
      gender: json['gender'] ?? '',
      email: json['email'] ?? '',
      dateOfBirth: json['dateOfBirth'] ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
      departmentName: json['department']?['name'] ?? '',
      facultyName: json['faculty']?['name'] ?? '',
      status: json['status'] ?? '',
    );
  }
}
