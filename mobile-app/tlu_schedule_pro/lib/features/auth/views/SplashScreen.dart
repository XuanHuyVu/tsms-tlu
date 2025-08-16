// lib/features/auth/views/SplashScreen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../viewmodels/AuthViewModel.dart';
import '../../student/views/screens/schedule_screen.dart';
import '../../teacher/views/screens/teacher_home_screen.dart'; // tên file snake_case
import 'LoginScreen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  bool _didNavigate = false;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthViewModel>(); // lắng nghe thay đổi

    // Điều hướng sau frame hiện tại để tránh lock
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_didNavigate || !mounted) return;

      final rawRole = (auth.user?.role ?? '').toString();
      final role = rawRole.trim().toUpperCase();

      Widget target;
      if (!auth.isLoggedIn) {
        target = const LoginScreen();
      } else if (role.contains('TEACHER')) {
        target = const TeacherHomeScreen();
      } else {
        target = const HomeScreen(); // student/khác
      }

      _didNavigate = true;
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (_, __, ___) => target,
          transitionDuration: Duration.zero,
          reverseTransitionDuration: Duration.zero,
        ),
      );
    });

    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}



// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../../viewmodels/AuthViewModel.dart';
// import 'ProfileScreen.dart'; // Thêm import cho ProfileScreen
// import 'LoginScreen.dart';
//
// class SplashScreen extends StatelessWidget {
//   const SplashScreen({super.key});
//
//   @override
//   Widget build(BuildContext context) {
//     final authViewModel = Provider.of<AuthViewModel>(context);
//
//     Future.delayed(Duration.zero, () {
//       // Luôn chuyển sang ProfileScreen
//       Navigator.pushReplacement(
//         context,
//         MaterialPageRoute(builder: (_) => const ProfileScreen()),
//       );
//     });
//
//     return const Scaffold(
//       body: Center(child: CircularProgressIndicator()),
//     );
//   }
// }

