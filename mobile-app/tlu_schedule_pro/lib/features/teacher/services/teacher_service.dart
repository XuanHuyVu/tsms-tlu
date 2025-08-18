// lib/features/teacher/services/teacher_service.dart
import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/services/ApiService.dart';
import '../models/teacher_model.dart';
import '../models/schedule_model.dart';

class TeacherHomeData {
  final TeacherModel teacher;
  final int periodsToday;
  final int periodsThisWeek;
  final int percentCompleted;
  final List<ScheduleModel> todaySchedules;

  const TeacherHomeData({
    required this.teacher,
    required this.periodsToday,
    required this.periodsThisWeek,
    required this.percentCompleted,
    required this.todaySchedules,
  });
}

class TeacherService {
  Future<int?> _getTeacherId() async {
    final p = await SharedPreferences.getInstance();
    return p.getInt('teacher_id');
  }

  Future<String?> _getFullName() async {
    final p = await SharedPreferences.getInstance();
    return p.getString('full_name');
  }

  bool _sameDate(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  DateTime _mondayOfWeek(DateTime d) {
    final weekday = d.weekday; // 1..7 (Mon..Sun)
    return DateTime(d.year, d.month, d.day).subtract(Duration(days: weekday - 1));
  }

  DateTime _sundayOfWeek(DateTime d) {
    final monday = _mondayOfWeek(d);
    return monday.add(const Duration(days: 6));
  }

  int _sumPeriods(List<ScheduleModel> xs) =>
      xs.fold(0, (acc, s) => acc + s.periodsCount);

  /// GET /api/teacher/schedules/{teacherId}
  Future<TeacherHomeData> fetchHomeData() async {
    final teacherId = await _getTeacherId();
    if (teacherId == null) {
      throw Exception('Không tìm thấy teacherId. Hãy đăng nhập lại.');
    }

    dynamic res;
    try {
      res = await ApiService.getJson('/api/teacher/schedules/$teacherId');
    } on TimeoutException {
      throw Exception('Hệ thống bận. Vui lòng thử lại sau.');
    } catch (e) {
      throw Exception('Không thể tải lịch dạy: $e');
    }

    // res là List các "môn", mỗi môn có classSection + details[]
    final List root = (res is List)
        ? res
        : (res is Map<String, dynamic>)
        ? (res['items'] ?? res['data'] ?? []) as List
        : const [];

    // ✅ Flatten: tạo 1 ScheduleModel cho mỗi phần tử trong details
    final List<ScheduleModel> all = [];
    for (final item in root.whereType<Map<String, dynamic>>()) {
      final section = (item['classSection'] ?? {}) as Map<String, dynamic>;
      final details = (item['details'] ?? []) as List;
      for (final d in details.whereType<Map<String, dynamic>>()) {
        all.add(ScheduleModel.fromSectionDetail(section: section, detail: d));
      }
    }

    // Lọc hôm nay / tuần này
    final now = DateTime.now();
    final today = all.where((s) {
      if (s.teachingDate == null) return true;
      return _sameDate(s.teachingDate!, now);
    }).toList();

    final monday = _mondayOfWeek(now);
    final sunday = _sundayOfWeek(now);
    bool inWeek(DateTime d) => !d.isBefore(monday) && !d.isAfter(sunday);

    final thisWeek = all.where((s) {
      if (s.teachingDate == null) return true;
      final d = DateTime(s.teachingDate!.year, s.teachingDate!.month, s.teachingDate!.day);
      return inWeek(d);
    }).toList();

    // Thống kê
    final periodsToday = _sumPeriods(today);
    final periodsThisWeek = _sumPeriods(thisWeek);
    final doneCount = today.where((s) => s.status == ScheduleStatus.done).length;
    final percentCompleted =
    today.isEmpty ? 0 : ((doneCount / today.length) * 100).round();

    // Thông tin GV
    final name = await _getFullName() ?? 'Giảng viên';

    // Lấy faculty từ record đầu tiên nếu có
    String faculty = '';
    if (root.isNotEmpty && root.first is Map<String, dynamic>) {
      final sec = (root.first as Map<String, dynamic>)['classSection'] as Map<String, dynamic>?;
      faculty = (sec?['faculty']?['name'])?.toString() ?? '';
    }

    final teacher = TeacherModel(
      id: teacherId,
      name: name,
      faculty: faculty,
    );

    return TeacherHomeData(
      teacher: teacher,
      periodsToday: periodsToday,
      periodsThisWeek: periodsThisWeek,
      percentCompleted: percentCompleted,
      todaySchedules: today,
    );
  }
}
