import 'package:flutter/material.dart';
import '../../views/screens/teacher_profile_screen.dart'; // import màn hình hồ sơ

class TeacherBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final String token; // cần truyền token để gọi API hồ sơ

  const TeacherBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
    required this.token,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      currentIndex: currentIndex,
      onTap: (index) {
        if (index == 4) {
          // Nếu bấm Hồ sơ
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => TeacherProfileScreen(token: token),
            ),
          );
        } else {
          onTap(index); // các tab khác thì callback về màn hình cha
        }
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'Trang chủ'),
        BottomNavigationBarItem(icon: Icon(Icons.calendar_month_rounded), label: 'Lịch dạy'),
        BottomNavigationBarItem(icon: Icon(Icons.notifications_rounded), label: 'Thông báo'),
        BottomNavigationBarItem(icon: Icon(Icons.bar_chart_rounded), label: 'Thống kê'),
        BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Hồ sơ'),
      ],
    );
  }
}
