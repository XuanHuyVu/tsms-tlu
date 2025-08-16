import '../models/teacher_model.dart';
import '../models/schedule_model.dart';

class TeacherHomeData {
  final TeacherModel teacher;
  final List<ScheduleModel> todaySchedules;

  TeacherHomeData({required this.teacher, required this.todaySchedules});
}

class TeacherService {
  // TODO: thay bằng gọi API thật
  Future<TeacherHomeData> fetchTeacherHome() async {
    await Future.delayed(const Duration(milliseconds: 500));

    final teacher = TeacherModel(
      id: 't001',
      name: 'ThS. Nguyễn Văn An',
      faculty: 'Khoa Công nghệ thông tin',
      avatarUrl: '',
      sessionsToday: 12,
      sessionsThisWeek: 42,
      progressPercent: 0.87,
    );

    final now = DateTime.now();
    final List<ScheduleModel> schedules = [
      ScheduleModel(
        id: 's1',
        periodLabel: 'Tiết 1 → 3 (7:00 - 9:40)',
        start: DateTime(now.year, now.month, now.day, 7, 00),
        end: DateTime(now.year, now.month, now.day, 9, 40),
        courseName: 'Phát triển ứng dụng chi các thiết bị di động 2-24',
        classCode: '(CSE4411_001)',
        room: '311 - B5',
        chapter: 'Chương 3: Xử lý dữ liệu và cơ sở dữ liệu SQLite',
        status: ScheduleStatus.ongoing,
      ),
      ScheduleModel(
        id: 's2',
        periodLabel: 'Tiết 4 → 6 (9:45 - 12:25)',
        start: DateTime(now.year, now.month, now.day, 9, 45),
        end: DateTime(now.year, now.month, now.day, 12, 25),
        courseName: 'Phát triển ứng dụng chi các thiết bị di động 2-24',
        classCode: '(CSE4411_002)',
        room: '311 - B5',
        chapter: 'Chương 3: Xử lý dữ liệu và cơ sở dữ liệu SQLite',
        status: ScheduleStatus.upcoming,
      ),
      ScheduleModel(
        id: 's3',
        periodLabel: 'Tiết 7 → 9 (12:55 - 15:35)',
        start: DateTime(now.year, now.month, now.day, 12, 55),
        end: DateTime(now.year, now.month, now.day, 15, 35),
        courseName: 'Phát triển ứng dụng chi các thiết bị di động 2-24',
        classCode: '(CSE4411_003)',
        room: '311 - B5',
        chapter: 'Chương 3: Xử lý dữ liệu và cơ sở dữ liệu SQLite',
        status: ScheduleStatus.canceled,
      ),
    ];

    return TeacherHomeData(teacher: teacher, todaySchedules: schedules);
  }
}
