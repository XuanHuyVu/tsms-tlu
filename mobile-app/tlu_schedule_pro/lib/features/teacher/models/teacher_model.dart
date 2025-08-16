class TeacherModel {
  final String id;
  final String name;
  final String faculty;
  final String avatarUrl;

  final int sessionsToday;
  final int sessionsThisWeek;
  final double progressPercent; // 0..1

  const TeacherModel({
    required this.id,
    required this.name,
    required this.faculty,
    required this.avatarUrl,
    required this.sessionsToday,
    required this.sessionsThisWeek,
    required this.progressPercent,
  });
}
