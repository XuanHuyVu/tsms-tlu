import 'package:flutter/material.dart';
import '../models/schedule_model.dart';
import '../services/teacher_service.dart';

class TeacherHomeViewModel extends ChangeNotifier {
  final _service = TeacherService();

  bool loading = false;
  String? error;

  int? teacherId;                 // ✅ id giảng viên
  String teacherName = '';
  String faculty = '';

  int periodsToday = 0;
  int periodsThisWeek = 0;
  int percentCompleted = 0;

  List<ScheduleModel> todaySchedules = const [];

  Future<void> load() async {
    loading = true;
    error = null;
    notifyListeners();

    try {
      final data = await _service.fetchHomeData();
      // ✅ Lưu thông tin từ API
      teacherId = data.teacher.id;   // đảm bảo Teacher có field id
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
}
