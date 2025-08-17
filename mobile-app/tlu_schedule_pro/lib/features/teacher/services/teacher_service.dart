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
  // Mock: return fixed data
  Future<TeacherHomeData> fetchHomeData() async {
    // mimic loading
    await Future.delayed(const Duration(milliseconds: 400));

    const teacher = TeacherModel(
      name: 'ThS. Nguyễn Văn An',
      faculty: 'Khoa Công nghệ thông tin',
    );

    const schedules = [
      ScheduleModel(
        periodText: 'Tiết 1 – 3 (7:00 - 9:40)',
        courseTitle:
        'Phát triển ứng dụng chi các thiết bị di động-2-24',
        classCode: 'CSE441_001',
        room: '311 - B5',
        chapter: 'Chương 3: Xử lý dữ liệu và cơ sở dữ liệu SQLite',
        status: ScheduleStatus.ongoing,
        bottomChips: ['Hoàn thành'],
      ),
      ScheduleModel(
        periodText: 'Tiết 4 – 6 (9:45 - 12:25)',
        courseTitle:
        'Phát triển ứng dụng chi các thiết bị di động-2-24',
        classCode: 'CSE441_002',
        room: '311 - B5',
        chapter: 'Chương 3: Xử lý dữ liệu và cơ sở dữ liệu SQLite',
        status: ScheduleStatus.upcoming,
        bottomChips: ['Nghỉ dạy'],
      ),
      ScheduleModel(
        periodText: 'Tiết 7 – 9 (12:55 - 15:35)',
        courseTitle:
        'Phát triển ứng dụng chi các thiết bị di động-2-24',
        classCode: 'CSE441_003',
        room: '311 - B5',
        chapter: 'Chương 3: Xử lý dữ liệu và cơ sở dữ liệu SQLite',
        status: ScheduleStatus.upcoming,
        bottomChips: ['Hoàn thành', 'Nghỉ dạy'],
      ),
    ];

    return const TeacherHomeData(
      teacher: teacher,
      periodsToday: 12,
      periodsThisWeek: 42,
      percentCompleted: 87,
      todaySchedules: schedules,
    );
  }
}