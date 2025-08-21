// lib/features/teacher/viewmodels/teacher_home_viewmodel.dart
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../models/schedule_model.dart';
import '../services/teacher_service.dart';
import '../services/teacher_schedule_service.dart';
import '../../auth/services/auth_service.dart';

class TeacherHomeViewModel extends ChangeNotifier {
  // Service lấy dữ liệu tổng quan trang Home
  final _service = TeacherService();

  // Service thao tác lịch dạy (attendance), tự gắn Authorization từ SharedPreferences
  final TeacherScheduleService _scheduleService = TeacherScheduleService(
    authHeaders: () async {
      final t = await AuthService.getToken(); // lấy token đã lưu khi login
      if (kDebugMode) {
        debugPrint(
          '🔑 Using token (len=${t?.length ?? 0}): '
              '${t == null ? "null" : t.substring(0, t.length > 12 ? 12 : t.length)}...',
        );
      }
      return t == null ? <String, String>{} : {'Authorization': 'Bearer $t'};
    },
  );

  // ----------------- State -----------------
  bool loading = false;
  String? error;

  int? teacherId; // id giảng viên
  String teacherName = '';
  String faculty = '';

  int periodsToday = 0;
  int periodsThisWeek = 0;
  int percentCompleted = 0; // nếu backend có trả % tổng, vẫn giữ để hiển thị

  List<ScheduleModel> todaySchedules = const [];

  // ----------------- Getters thống kê hôm nay -----------------
  /// Tổng số buổi (item) trong hôm nay trên Home
  int get totalTodaySessions => todaySchedules.length;

  /// Số buổi đã hoàn thành trong hôm nay (trạng thái done)
  int get completedTodaySessions =>
      todaySchedules.where((s) => s.status == ScheduleStatus.done).length;

  /// % hoàn thành trong hôm nay (tính local theo danh sách todaySchedules)
  int get percentTodayCompleted => totalTodaySessions == 0
      ? 0
      : ((completedTodaySessions * 100) / totalTodaySessions).round();

  // ----------------- Actions -----------------
  Future<void> load() async {
    loading = true;
    error = null;
    notifyListeners();

    try {
      final data = await _service.fetchHomeData();

      // Lưu info
      teacherId = data.teacher.id;
      teacherName = data.teacher.name;
      faculty = data.teacher.faculty;

      periodsToday = data.periodsToday;
      periodsThisWeek = data.periodsThisWeek;
      percentCompleted = data.percentCompleted; // tuỳ backend, có thể là % tuần/tháng

      // Danh sách lịch hôm nay (dùng để hiển thị + đếm)
      todaySchedules = data.todaySchedules;
    } catch (e) {
      error = e.toString();
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  /// Đánh dấu "Hoàn thành" cho 1 lịch dạy (detail)
  Future<void> markDone(ScheduleModel item) async {
    // Bảo vệ: cần có id chi tiết lịch
    if (item.id == 0) {
      throw Exception(
        'Thiếu schedule detail id (id=0). Hãy đảm bảo map đúng "detail.id" vào ScheduleModel.id.',
      );
    }

    // Tìm vị trí item trong danh sách
    final idx = todaySchedules.indexWhere((s) => s.id == item.id);
    ScheduleModel? prev;

    // 1) Optimistic update để UI phản hồi tức thì
    if (idx != -1) {
      prev = todaySchedules[idx];
      final updated = prev.copyWith(status: ScheduleStatus.done);
      final clone = [...todaySchedules];
      clone[idx] = updated;
      todaySchedules = clone;
      notifyListeners();
    }

    try {
      // 2) Gọi API attendance
      final res = await _scheduleService.markAsDone(item.id);

      // 3) Nếu backend trả status → map lại cho chắc
      final fromApi = statusFromApi(res['status'] as String?);
      if (idx != -1 && fromApi != ScheduleStatus.unknown) {
        final clone = [...todaySchedules];
        clone[idx] = (prev ?? item).copyWith(status: fromApi);
        todaySchedules = clone;
        notifyListeners();
      }

      // 4) Reload toàn bộ để đồng bộ với server (nếu không muốn reload thì bỏ dòng này)
      await load();
    } catch (e) {
      // Lỗi → rollback về trước đó nếu đã optimistic
      if (idx != -1 && prev != null) {
        final clone = [...todaySchedules];
        clone[idx] = prev;
        todaySchedules = clone;
        notifyListeners();
      }
      // Ném lỗi ra cho UI hiển thị dialog/toast
      throw Exception('Cập nhật thất bại: $e');
    }
  }

  /// (Tuỳ chọn) Cập nhật trạng thái local 1 item theo id — hữu ích khi muốn đồng bộ nhanh với tab khác.
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
