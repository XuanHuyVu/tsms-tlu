import 'package:flutter/material.dart';

import '../models/schedule_model.dart';
import '../services/teacher_service.dart';
import '../services/teacher_schedule_service.dart';
import '../../auth/services/auth_service.dart';

class TeacherScheduleViewModel extends ChangeNotifier {
  final _service = TeacherService();

  final TeacherScheduleService _scheduleService = TeacherScheduleService(
    authHeaders: () async {
      final t = await AuthService.getToken();
      return t == null ? <String, String>{} : {'Authorization': 'Bearer $t'};
    },
  );

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
      all = [...all]..sort((a, b) => a.periodStart.compareTo(b.periodStart));
    } catch (e) {
      error = e.toString();
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  List<ScheduleModel> get daySchedules {
    final list = all.where((s) {
      final d = s.teachingDate;
      if (d == null) return false;
      return d.year == selectedDate.year &&
          d.month == selectedDate.month &&
          d.day == selectedDate.day;
    }).toList();
    list.sort((a, b) => a.periodStart.compareTo(b.periodStart));
    return list;
  }

  Map<DateTime, List<ScheduleModel>> get weekGrouped {
    if (all.isEmpty) return {};
    final monday = selectedDate.subtract(Duration(days: selectedDate.weekday - 1));
    final sunday = monday.add(const Duration(days: 6));

    bool inWeek(DateTime d) {
      final dd = DateTime(d.year, d.month, d.day);
      return !dd.isBefore(DateTime(monday.year, monday.month, monday.day)) &&
          !dd.isAfter(DateTime(sunday.year, sunday.month, sunday.day));
    }

    final map = <DateTime, List<ScheduleModel>>{};
    for (final s in all) {
      final d = s.teachingDate;
      if (d == null || !inWeek(d)) continue;
      final key = DateTime(d.year, d.month, d.day);
      (map[key] ??= []).add(s);
    }
    for (final k in map.keys) {
      map[k]!.sort((a, b) => a.periodStart.compareTo(b.periodStart));
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

  void applyStatus(int id, ScheduleStatus status) {
    final i = all.indexWhere((e) => e.id == id);
    if (i != -1) {
      all[i] = all[i].copyWith(status: status);
      notifyListeners();
    }
  }

  Future<void> markDone(ScheduleModel item) async {
    final idx = all.indexWhere((e) => e.id == item.id);
    if (idx == -1) return;

    final prev = all[idx];
    all[idx] = prev.copyWith(status: ScheduleStatus.done);
    notifyListeners();

    try {
      final res = await _scheduleService.markAsDone(item.id);
      final st = statusFromApi(res['status'] as String?);
      if (st != ScheduleStatus.unknown) {
        all[idx] = prev.copyWith(status: st);
        notifyListeners();
      }
    } catch (e) {
      all[idx] = prev;
      notifyListeners();
      rethrow;
    }
  }

  /// Gửi yêu cầu NGHỈ DẠY
  Future<Map<String, dynamic>> requestCancel(
      ScheduleModel item, {
        required String reason,
        String? fileUrl,
      }) async {
    if (item.id == 0) throw Exception('Thiếu detailId để gửi nghỉ dạy');
    final res = await _scheduleService.requestClassCancel(
      detailId: item.id,
      reason: reason,
      fileUrl: fileUrl,
    );
    return res;
  }
}
