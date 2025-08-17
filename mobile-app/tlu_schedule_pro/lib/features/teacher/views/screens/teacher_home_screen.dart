import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/teacher_home_viewmodel.dart';
import '../../services/teacher_service.dart';
import '../widgets/teacher_info_card.dart';
import '../widgets/schedule_card.dart';
import '../widgets/bottom_nav_bar.dart';

class TeacherHomeScreen extends StatefulWidget {
  const TeacherHomeScreen({super.key});

  @override
  State<TeacherHomeScreen> createState() => _TeacherHomeScreenState();
}

class _TeacherHomeScreenState extends State<TeacherHomeScreen> {
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => TeacherHomeViewModel(TeacherService())..load(),
      child: Consumer<TeacherHomeViewModel>(
        builder: (context, vm, _) {
          return Scaffold(
            backgroundColor: const Color(0xFFF7F8FC),
            appBar: AppBar(
              backgroundColor: Colors.white,
              elevation: 0,
              title: Image.asset(
                'assets/images/Truong_DHTL.png', // <- dùng ảnh local
                height: 40,
                fit: BoxFit.contain,
              ),
              centerTitle: false,
              actions: const [
                Icon(Icons.search_rounded),
                SizedBox(width: 8),
                Icon(Icons.notifications_none_rounded),
                SizedBox(width: 12),
              ],
            ),
            body: vm.isLoading
                ? const Center(child: CircularProgressIndicator())
                : SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TeacherInfoCard(
                    teacher: vm.data!.teacher,
                    periodsToday: vm.data!.periodsToday,
                    periodsThisWeek: vm.data!.periodsThisWeek,
                    percentCompleted: vm.data!.percentCompleted,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Lịch dạy hôm nay',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                      TextButton(
                        onPressed: () {},
                        child: const Text('Xem tất cả'),
                      ),
                    ],
                  ),
                  ...vm.schedules.map((e) => ScheduleCard(item: e)),
                ],
              ),
            ),
            bottomNavigationBar: TeacherBottomNavBar(
              currentIndex: _tab,
              onTap: (i) => setState(() => _tab = i),
            ),
          );
        },
      ),
    );
  }
}
