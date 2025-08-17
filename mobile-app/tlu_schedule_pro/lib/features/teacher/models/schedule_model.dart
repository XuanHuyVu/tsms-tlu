import 'package:flutter/material.dart';

enum ScheduleStatus { completed, ongoing, upcoming }

extension ScheduleStatusX on ScheduleStatus {
  String get label {
    switch (this) {
      case ScheduleStatus.completed:
        return 'HOÀN THÀNH';
      case ScheduleStatus.ongoing:
        return 'ĐANG DIỄN RA';
      case ScheduleStatus.upcoming:
        return 'SẮP DIỄN RA';
    }
  }

  Color get color {
    switch (this) {
      case ScheduleStatus.completed:
        return const Color(0xFF2EB872); // green
      case ScheduleStatus.ongoing:
        return const Color(0xFF2F80ED); // blue
      case ScheduleStatus.upcoming:
        return const Color(0xFFF2994A); // orange
    }
  }
}

class ScheduleModel {
  final String periodText; // "Tiết 1 – 3 (7:00 - 9:40)"
  final String courseTitle; // "Phát triển ứng dụng..."
  final String classCode; // "CSE441_001"
  final String room; // "311 - B5"
  final String chapter; // "Chương 3: ..."
  final ScheduleStatus status; // top right badge
  final List<String> bottomChips; // e.g., ["Hoàn thành", "Nghỉ dạy"]

  const ScheduleModel({
    required this.periodText,
    required this.courseTitle,
    required this.classCode,
    required this.room,
    required this.chapter,
    required this.status,
    this.bottomChips = const [],
  });
}