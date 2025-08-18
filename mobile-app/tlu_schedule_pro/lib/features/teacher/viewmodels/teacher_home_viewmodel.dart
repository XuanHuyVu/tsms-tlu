import 'package:flutter/foundation.dart';
import '../models/schedule_model.dart';
import '../services/teacher_service.dart';

class TeacherHomeViewModel extends ChangeNotifier {
  final TeacherService _service;
  TeacherHomeViewModel(this._service);

  bool isLoading = true;
  TeacherHomeData? data;

  Future<void> load() async {
    isLoading = true;
    notifyListeners();
    data = await _service.fetchHomeData();
    isLoading = false;
    notifyListeners();
  }
  List<ScheduleModel> get schedules => data?.todaySchedules ?? [];
}
