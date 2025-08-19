class StudentScheduleModel {
  final int classSectionId;
  final String classSectionName;
  final String subjectName;
  final String teacherName;
  final String roomCode;
  final DateTime? teachingDate;
  final String periodStart;
  final String periodEnd;
  final String type;

  StudentScheduleModel({
    required this.classSectionId,
    required this.classSectionName,
    required this.subjectName,
    required this.teacherName,
    required this.roomCode,
    required this.teachingDate,
    required this.periodStart,
    required this.periodEnd,
    required this.type,
  });

  factory StudentScheduleModel.fromJson(Map<String, dynamic> json) {
    return StudentScheduleModel(
      classSectionId: json['classSectionId'] as int,
      classSectionName: json['classSectionName'] ?? '',
      subjectName: json['subjectName'] ?? '',
      teacherName: json['teacherName'] ?? '',
      roomCode: json['roomCode'] ?? '',
      teachingDate: json['teachingDate'] != null
          ? DateTime.tryParse(json['teachingDate'])
          : null,
      periodStart: json['periodStart'] ?? '',
      periodEnd: json['periodEnd'] ?? '',
      type: json['type'] ?? '',
    );
  }
}