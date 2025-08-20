import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../../viewmodels/teacher_home_viewmodel.dart';
import '../../viewmodels/teacher_profile_viewmodel.dart';
import '../../../../core/constants/constants.dart';
import '../widgets/schedule_card.dart';
import '../widgets/bottom_nav_bar.dart';
import '../widgets/stats_panel.dart';
import 'teacher_schedule_screen.dart';
import 'teacher_profile_screen.dart';


class TeacherHomeScreen extends StatefulWidget {
  const TeacherHomeScreen({super.key});

  @override
  State<TeacherHomeScreen> createState() => _TeacherHomeScreenState();
}

class _TeacherHomeScreenState extends State<TeacherHomeScreen> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => TeacherHomeViewModel()..load(),
      child: Consumer<TeacherHomeViewModel>(
        builder: (context, vm, _) {
          final int? teacherId = vm.teacherId;

          final Widget profileTab = (teacherId == null || teacherId <= 0)
              ? const SafeArea(
            child: Center(child: Text('Đang chuẩn bị dữ liệu hồ sơ...')),
          )
              : ChangeNotifierProvider(
            key: ValueKey('profile-provider-$teacherId'),
            create: (_) => TeacherProfileViewModel(),
            child: TeacherProfileScreen(
              key: ValueKey('profile-screen-$teacherId'),
              teacherId: teacherId,
            ),
          );

          final pages = <Widget>[
            _HomeTab(onSeeAll: () => setState(() => _index = 1)),
            const TeacherScheduleScreen(),
            const _NotifyTab(),
            const _StatsTab(),
            profileTab,
          ];

          return Scaffold(
            body: IndexedStack(index: _index, children: pages),
            bottomNavigationBar: TeacherBottomNavBar(
              currentIndex: _index,
              onTap: (i) => setState(() => _index = i),
            ),
          );
        },
      ),
    );
  }
}

/// Trang chủ (dashboard)
class _HomeTab extends StatelessWidget {
  final VoidCallback onSeeAll;
  const _HomeTab({required this.onSeeAll});

  @override
  Widget build(BuildContext context) {
    final vm = context.watch<TeacherHomeViewModel>();

    if (vm.loading) {
      return const SafeArea(child: Center(child: CircularProgressIndicator()));
    }
    if (vm.error != null) {
      return SafeArea(child: Center(child: Text('Lỗi: ${vm.error}')));
    }

    final todayStr = formatDdMMyyyy(DateTime.now());
    final displayName =
    vm.teacherName.isNotEmpty ? vm.teacherName : 'Giảng viên';

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(12),
        children: <Widget>[
          // Header: logo + chuông + avatar chữ viết tắt
          _TopBar(name: displayName),
          const SizedBox(height: 12),

          // ✅ 3 ô thống kê đặt trực tiếp, không nằm trong Card
          StatsPanel(
            periodsToday: vm.periodsToday,
            periodsThisWeek: vm.periodsThisWeek,
            percentCompleted: vm.percentCompleted,
          ),

          const SizedBox(height: 16),

        // Header danh sách lịch hôm nay
// Header danh sách lịch hôm nay (đẹp hơn)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text.rich(
                  TextSpan(
                    children: [
                      TextSpan(
                        text: 'Lịch dạy hôm nay ',
                        style: GoogleFonts.beVietnamPro(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          height: 1.1,
                          letterSpacing: .2,
                          color: const Color(0xFF2563EB), // xanh 600
                        ),
                      ),
                      TextSpan(
                        text: '($todayStr)',
                        style: GoogleFonts.beVietnamPro(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          height: 1.1,
                          color: const Color(0xFF111827), // đen xám
                        ),
                      ),
                    ],
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              TextButton(
                onPressed: onSeeAll,
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  foregroundColor: const Color(0xFF2563EB),
                  textStyle: GoogleFonts.beVietnamPro(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    letterSpacing: .2,
                  ),
                ),
                child: const Text('Xem tất cả'),
              ),
            ],
          ),


          // Danh sách lịch hôm nay
          ...vm.todaySchedules.map((e) => ScheduleCard(item: e)),
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
  }
}

/// Header: logo + chuông + avatar viết tắt tên
class _TopBar extends StatelessWidget {
  final String name;
  const _TopBar({super.key, required this.name});

  String _getInitials(String fullName) {
    final parts = fullName.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) return (parts.first[0] + parts.last[0]).toUpperCase();
    if (parts.isNotEmpty) return parts.first[0].toUpperCase();
    return '';
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Row(
        children: [
          Image.asset('assets/images/LOGO_THUYLOI.png', height: 28),
          const Spacer(),
          IconButton(
            onPressed: () {
              // TODO: mở trang thông báo
            },
            icon: const Icon(Icons.notifications_rounded),
          ),
          CircleAvatar(
            radius: 18,
            backgroundColor: const Color(0xFF2F6BFF),
            child: Text(
              _getInitials(name),
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
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