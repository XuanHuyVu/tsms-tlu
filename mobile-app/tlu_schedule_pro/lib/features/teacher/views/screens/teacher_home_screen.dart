import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../viewmodels/teacher_home_viewmodel.dart';
import '../../models/teacher_model.dart';
import '../../../../core/constants/constants.dart'; // formatDdMMyyyy
import '../widgets/schedule_card.dart';
import '../widgets/bottom_nav_bar.dart';
import '../widgets/teacher_info_card.dart';

class TeacherHomeScreen extends StatefulWidget {
  const TeacherHomeScreen({super.key});

  @override
  State<TeacherHomeScreen> createState() => _TeacherHomeScreenState();
}

class _TeacherHomeScreenState extends State<TeacherHomeScreen> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = <Widget>[
      const _HomeTab(),
      const _ScheduleTab(),
      const _NotifyTab(),
      const _StatsTab(),
      const _ProfileTab(),
    ];

    return Scaffold(
      body: IndexedStack(index: _index, children: pages),
      bottomNavigationBar: TeacherBottomNavBar(
        currentIndex: _index,
        onTap: (i) => setState(() => _index = i),
      ),
    );
  }
}

/// ======= TAB 1: Trang chủ =======
class _HomeTab extends StatelessWidget {
  const _HomeTab();

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => TeacherHomeViewModel()..load(),
      child: Consumer<TeacherHomeViewModel>(
        builder: (context, vm, _) {
          if (vm.loading) {
            return const SafeArea(child: Center(child: CircularProgressIndicator()));
          }
          if (vm.error != null) {
            return SafeArea(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text('Lỗi: ${vm.error}', textAlign: TextAlign.center),
                ),
              ),
            );
          }

          final todayStr = formatDdMMyyyy(DateTime.now());

          return SafeArea(
            child: ListView(
              padding: const EdgeInsets.all(12),
              children: <Widget>[
                const _TopBar(), // logo (trái) + thông báo + tìm kiếm (phải)
                const SizedBox(height: 12),

                // ===== Card tổng quan: Info GV + 3 ô thống kê =====
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(.06),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                    border: Border.all(color: Colors.black12),
                  ),
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(12, 12, 12, 6),
                        child: TeacherInfoCard(
                          compact: true,
                          teacher: TeacherModel(
                            id: 0,
                            name: vm.teacherName.isNotEmpty ? vm.teacherName : 'Giảng viên',
                            faculty: vm.faculty.isNotEmpty ? vm.faculty : '',
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
                        child: _StatsPanel(
                          periodsToday: vm.periodsToday,
                          periodsThisWeek: vm.periodsThisWeek,
                          percentCompleted: vm.percentCompleted,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // ===== Tiêu đề danh sách lịch hôm nay =====
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(children: [
                      const Text(
                        'Lịch dạy hôm nay',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(.08),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          todayStr,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Colors.blue,
                          ),
                        ),
                      ),
                    ]),
                    TextButton(
                      onPressed: () {
                        // chuyển sang tab lịch dạy nếu muốn:
                        // Default tạm để trống
                      },
                      child: const Text('Xem tất cả'),
                    ),
                  ],
                ),

                // ===== Danh sách lịch hôm nay =====
                ...vm.todaySchedules.map((e) => ScheduleCard(item: e)).toList(),

                if (vm.todaySchedules.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 40),
                    child: Center(child: Text('Hôm nay không có lịch dạy.')),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}

/// Top bar: nền trắng, logo trái, chuông + tìm kiếm phải
class _TopBar extends StatelessWidget {
  const _TopBar();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(.05), blurRadius: 8, offset: const Offset(0, 3)),
        ],
        border: Border.all(color: Colors.black12),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: Image.asset(
              'assets/images/LOGO_THUYLOI.png', // đổi theo tên file của bạn
              height: 24,
              fit: BoxFit.contain,
            ),
          ),
          const Spacer(),
          Stack(
            clipBehavior: Clip.none,
            children: [
              IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_rounded)),
              Positioned(
                right: 6,
                top: 6,
                child: Container(
                  height: 16,
                  padding: const EdgeInsets.symmetric(horizontal: 5),
                  decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(10)),
                  child: const Center(
                    child: Text('2', style: TextStyle(color: Colors.white, fontSize: 10)),
                  ),
                ),
              ),
            ],
          ),
          IconButton(onPressed: () {}, icon: const Icon(Icons.search_rounded)),
        ],
      ),
    );
  }
}

/// Panel 3 ô thống kê (xanh nhạt)
class _StatsPanel extends StatelessWidget {
  final int periodsToday;
  final int periodsThisWeek;
  final int percentCompleted;
  const _StatsPanel({
    required this.periodsToday,
    required this.periodsThisWeek,
    required this.percentCompleted,
  });

  static const Color lightBlue = Color(0xFFE8F1FF);
  static const Color textBlue = Color(0xFF2F6BFF);

  Widget _tile(String title, String value) => Expanded(
    child: Container(
      margin: const EdgeInsets.symmetric(horizontal: 4),
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: lightBlue,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 18,
              color: textBlue,
            ),
          ),
          const SizedBox(height: 6),
          const SizedBox(height: 2),
          Text(title, style: const TextStyle(color: textBlue)),
        ],
      ),
    ),
  );

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _tile('Tiết hôm nay', '$periodsToday'),
        _tile('Tiết tuần này', '$periodsThisWeek'),
        _tile('Hoàn thành', '$percentCompleted%'),
      ],
    );
  }
}

/// ======= Các tab khác (placeholder) =======
class _ScheduleTab extends StatelessWidget {
  const _ScheduleTab();
  @override
  Widget build(BuildContext context) =>
      const SafeArea(child: Center(child: Text('Lịch dạy (đang phát triển)')));
}

class _NotifyTab extends StatelessWidget {
  const _NotifyTab();
  @override
  Widget build(BuildContext context) =>
      const SafeArea(child: Center(child: Text('Thông báo (đang phát triển)')));
}

class _StatsTab extends StatelessWidget {
  const _StatsTab();
  @override
  Widget build(BuildContext context) =>
      const SafeArea(child: Center(child: Text('Thống kê (đang phát triển)')));
}

class _ProfileTab extends StatelessWidget {
  const _ProfileTab();
  @override
  Widget build(BuildContext context) =>
      const SafeArea(child: Center(child: Text('Hồ sơ (đang phát triển)')));
}
