import 'package:flutter/foundation.dart';
import '../models/teacher_model.dart';
import '../models/schedule_model.dart';
import '../services/teacher_service.dart';

class TeacherHomeViewModel extends ChangeNotifier {
  final TeacherService _service;

  TeacherHomeViewModel(this._service);

  TeacherModel? teacher;
  List<ScheduleModel> schedules = [];
  bool loading = false;
  String? error;

  Future<void> load() async {
    try {
      loading = true;
      error = null;
      notifyListeners();

      final data = await _service.fetchTeacherHome();
      teacher = data.teacher;
      schedules = data.todaySchedules;

      loading = false;
      notifyListeners();
    } catch (e) {
      loading = false;
      error = e.toString();
      notifyListeners();
    }
  }
}
