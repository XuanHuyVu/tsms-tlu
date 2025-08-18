import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../viewmodels/teacher_home_viewmodel.dart';
import '../../models/teacher_model.dart';
import '../../../../core/constants/constants.dart';
import '../widgets/schedule_card.dart';
import '../widgets/bottom_nav_bar.dart';
import '../widgets/teacher_info_card.dart';
import '../widgets/stats_panel.dart';
import 'teacher_schedule_screen.dart'; // màn Lịch dạy

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
      _HomeTab(                               // <-- truyền callback
        onSeeAll: () => setState(() => _index = 1),
      ),
      const TeacherScheduleScreen(),
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

/// Trang chủ (dashboard)
class _HomeTab extends StatelessWidget {
  final VoidCallback onSeeAll;               // <-- nhận callback
  const _HomeTab({required this.onSeeAll});

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
            return SafeArea(child: Center(child: Text('Lỗi: ${vm.error}')));
          }

          final todayStr = formatDdMMyyyy(DateTime.now());

          return SafeArea(
            child: ListView(
              padding: const EdgeInsets.all(12),
              children: <Widget>[
                const _TopBar(),
                const SizedBox(height: 12),

                // Card: Info GV + 3 ô thống kê
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
                        child: StatsPanel(
                          periodsToday: vm.periodsToday,
                          periodsThisWeek: vm.periodsThisWeek,
                          percentCompleted: vm.percentCompleted,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Header danh sách lịch hôm nay
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(children: [
                      const Text('Lịch dạy hôm nay',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.blue.withValues(alpha: 0.08),   // <- đổi from withOpacity
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
                      onPressed: onSeeAll,                        // <-- dùng callback
                      child: const Text('Xem tất cả'),
                    ),
                  ],
                ),

                // Danh sách lịch hôm nay
                ...vm.todaySchedules.map((e) => ScheduleCard(item: e)).toList(),
                if (vm.todaySchedules.isEmpty)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 40),
                      child: Text('Hôm nay không có lịch dạy.'),
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}

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
          Image.asset('assets/images/LOGO_THUYLOI.png', height: 24),
          const Spacer(),
          IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_rounded)),
          IconButton(onPressed: () {}, icon: const Icon(Icons.search_rounded)),
        ],
      ),
    );
  }
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
