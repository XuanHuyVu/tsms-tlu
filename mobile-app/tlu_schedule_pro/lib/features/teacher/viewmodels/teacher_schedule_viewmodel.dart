import 'package:flutter/material.dart';
import '../models/schedule_model.dart';
import '../services/teacher_service.dart';

class TeacherScheduleViewModel extends ChangeNotifier {
  final _service = TeacherService();

  bool loading = false;
  String? error;

  DateTime selectedDate = DateTime.now();
  List<ScheduleModel> all = const [];

  Future<void> load() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      all = await _service.fetchAllSchedules();
    } catch (e) {
      error = e.toString();
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  List<ScheduleModel> get daySchedules {
    return all.where((s) {
      final d = s.teachingDate;
      if (d == null) return false;
      return d.year == selectedDate.year &&
          d.month == selectedDate.month &&
          d.day == selectedDate.day;
    }).toList();
  }

  Map<DateTime, List<ScheduleModel>> get weekGrouped {
    if (all.isEmpty) return {};
    final monday = selectedDate.subtract(Duration(days: selectedDate.weekday - 1));
    final sunday = monday.add(const Duration(days: 6));

    bool inWeek(DateTime d) =>
        !DateTime(d.year, d.month, d.day)
            .isBefore(DateTime(monday.year, monday.month, monday.day)) &&
            !DateTime(d.year, d.month, d.day)
                .isAfter(DateTime(sunday.year, sunday.month, sunday.day));

    final map = <DateTime, List<ScheduleModel>>{};
    for (final s in all) {
      final d = s.teachingDate;
      if (d == null) continue;
      if (!inWeek(d)) continue;
      final key = DateTime(d.year, d.month, d.day);
      (map[key] ??= []).add(s);
    }
    final keys = map.keys.toList()..sort();
    return {for (final k in keys) k: map[k]!};
  }

  void pickDate(DateTime d) {
    selectedDate = d;
    notifyListeners();
  }

  void shiftWeek(int dir) {
    selectedDate = selectedDate.add(Duration(days: 7 * dir));
    notifyListeners();
  }
}
