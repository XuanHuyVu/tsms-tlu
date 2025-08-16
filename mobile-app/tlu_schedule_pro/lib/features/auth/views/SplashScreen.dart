import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../viewmodels/AuthViewModel.dart';
import '../../student/views/screens/schedule_screen.dart';
import 'LoginScreen.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authViewModel = Provider.of<AuthViewModel>(context);

    Future.delayed(Duration.zero, () {
      if (authViewModel.isLoggedIn) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      } else {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
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

