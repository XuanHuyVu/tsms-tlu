// import 'package:flutter/material.dart';
//
// class HomeScreen extends StatelessWidget {
//   const HomeScreen({super.key});
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Home'),
//       ),
//       body: const Center(
//         child: Text(
//           'Welcome to the Home Screen!',
//           style: TextStyle(fontSize: 24),
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:tlu_schedule_pro/shared/widgets/custom_app_bar.dart';
import 'package:tlu_schedule_pro/features/student/views/screens/ProfileScreen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'TLU SCHEDULE PRO',
        onNotificationTap: () {
          debugPrint('Notification tapped');
        },
        onProfileTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const ProfileScreen(),
            ),
          );
        },

      ),
      body: const Center(
        child: Text(
          'Welcome to the Home Screen!',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}

