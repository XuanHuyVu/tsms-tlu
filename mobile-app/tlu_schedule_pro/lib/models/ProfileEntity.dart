class ProfileEntity {
  final String fullName;
  final String studentId;
  final String email;
  final String dateOfBirth;
  final String className;
  final String faculty;
  final String major;
  final int admissionYear;

  ProfileEntity({
    required this.fullName,
    required this.studentId,
    required this.email,
    required this.dateOfBirth,
    required this.className,
    required this.faculty,
    required this.major,
    required this.admissionYear,
  });

  factory ProfileEntity.fromJson(Map<String, dynamic> json) {
    return ProfileEntity(
      fullName: json['fullName'] ?? '',
      studentId: json['studentId'] ?? '',
      email: json['email'] ?? '',
      dateOfBirth: json['dateOfBirth'] ?? '',
      className: json['className'] ?? '',
      faculty: json['faculty'] ?? '',
      major: json['major'] ?? '',
      admissionYear: json['admissionYear'] ?? 0,
    );
  }
}
