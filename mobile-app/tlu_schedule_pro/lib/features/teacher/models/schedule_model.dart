enum ScheduleStatus {
  ongoing,     // Đang diễn ra
  upcoming,    // Sắp diễn ra
  finished,    // Hoàn thành / đã kết thúc
  canceled,    // Nghỉ dạy
}

class ScheduleModel {
  final String id;
  final String periodLabel;        // "Tiết 1 → 3 (7:00 - 9:40)"
  final DateTime start;
  final DateTime end;
  final String courseName;         // "Phát triển ứng dụng..."
  final String classCode;          // "(CSE4411_001)"
  final String room;               // "311 - B5"
  final String chapter;            // "Chương 3: ... SQLite"
  final ScheduleStatus status;

  const ScheduleModel({
    required this.id,
    required this.periodLabel,
    required this.start,
    required this.end,
    required this.courseName,
    required this.classCode,
    required this.room,
    required this.chapter,
    required this.status,
  });
}
