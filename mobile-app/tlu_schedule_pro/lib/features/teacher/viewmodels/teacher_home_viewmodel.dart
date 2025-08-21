import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../models/schedule_model.dart';
import '../services/teacher_service.dart';
import '../services/teacher_schedule_service.dart';
import '../../auth/services/auth_service.dart';

class TeacherHomeViewModel extends ChangeNotifier {
  final _service = TeacherService();

  final TeacherScheduleService _scheduleService = TeacherScheduleService(
    authHeaders: () async {
      final t = await AuthService.getToken();
      if (kDebugMode) {
        debugPrint('🔑 Using token (len=${t?.length ?? 0}): '
            '${t == null ? "null" : t.substring(0, t.length > 12 ? 12 : t.length)}...');
      }
      return t == null ? <String, String>{} : {'Authorization': 'Bearer $t'};
    },
  );

  // ----------------- State -----------------
  bool loading = false;
  String? error;

  int? teacherId;
  String teacherName = '';
  String faculty = '';

  int periodsToday = 0;
  int periodsThisWeek = 0;
  int percentCompleted = 0;

  List<ScheduleModel> todaySchedules = const [];

  // ----------------- Stats (local for today) -----------------
  int get totalTodaySessions => todaySchedules.length;
  int get completedTodaySessions =>
      todaySchedules.where((s) => s.status == ScheduleStatus.done).length;
  int get percentTodayCompleted =>
      totalTodaySessions == 0 ? 0 : ((completedTodaySessions * 100) / totalTodaySessions).round();

  // ----------------- Actions -----------------
  Future<void> load() async {
    loading = true;
    error = null;
    notifyListeners();

    try {
      final data = await _service.fetchHomeData();

      teacherId = data.teacher.id;
      teacherName = data.teacher.name;
      faculty = data.teacher.faculty;

      periodsToday = data.periodsToday;
      periodsThisWeek = data.periodsThisWeek;
      percentCompleted = data.percentCompleted;

      todaySchedules = data.todaySchedules;
    } catch (e) {
      error = e.toString();
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> markDone(ScheduleModel item) async {
    if (item.id == 0) {
      throw Exception('Thiếu schedule detail id (id=0).');
    }

    final idx = todaySchedules.indexWhere((s) => s.id == item.id);
    ScheduleModel? prev;

    if (idx != -1) {
      prev = todaySchedules[idx];
      final updated = prev.copyWith(status: ScheduleStatus.done);
      final clone = [...todaySchedules];
      clone[idx] = updated;
      todaySchedules = clone;
      notifyListeners();
    }

    try {
      final res = await _scheduleService.markAsDone(item.id);
      final fromApi = statusFromApi(res['status'] as String?);
      if (idx != -1 && fromApi != ScheduleStatus.unknown) {
        final clone = [...todaySchedules];
        clone[idx] = (prev ?? item).copyWith(status: fromApi);
        todaySchedules = clone;
        notifyListeners();
      }
      await load();
    } catch (e) {
      if (idx != -1 && prev != null) {
        final clone = [...todaySchedules];
        clone[idx] = prev;
        todaySchedules = clone;
        notifyListeners();
      }
      throw Exception('Cập nhật thất bại: $e');
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
    // Có thể reload Home nếu bạn muốn thấy số liệu thay đổi
    // await load();
    return res;
  }

  /// Đồng bộ nhanh 1 item theo id
  void applyStatusLocal(int id, ScheduleStatus status) {
    final i = todaySchedules.indexWhere((e) => e.id == id);
    if (i != -1) {
      final clone = [...todaySchedules];
      clone[i] = clone[i].copyWith(status: status);
      todaySchedules = clone;
      notifyListeners();
    }
  }
}
