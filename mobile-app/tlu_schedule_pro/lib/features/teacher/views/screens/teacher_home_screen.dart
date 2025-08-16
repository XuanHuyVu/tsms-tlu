import 'package:flutter/material.dart';
import '../widgets/bottom_nav_bar.dart'; // Đảm bảo đường dẫn này đúng!

class TeacherHomeScreen extends StatefulWidget {
  const TeacherHomeScreen({super.key});

  @override
  State<TeacherHomeScreen> createState() => _TeacherHomeScreenState();
}

class _TeacherHomeScreenState extends State<TeacherHomeScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const Center(child: Text('Trang chủ')),
    const Center(child: Text('Lịch dạy')),
    const Center(child: Text('Thông báo')),
    const Center(child: Text('Thống kê')),
    const Center(child: Text('Hồ sơ')),
  ];

  void _onTabTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: TeacherBottomNavBar(
        currentIndex: _selectedIndex,
        onTap: _onTabTapped,
      ),
    );
  }
}
