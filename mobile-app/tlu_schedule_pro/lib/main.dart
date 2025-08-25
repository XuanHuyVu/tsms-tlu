import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'features/auth/viewmodels/auth_viewmodel.dart';
import 'features/student/viewmodels/schedule_viewmodel.dart';
import 'features/auth/views/splash_screen.dart';
import 'features/auth/views/login_screen.dart';
import 'features/student/views/screens/schedule_screen.dart';

// 🔔 import service theo đúng path bạn đang để (lib/notification/…)
import '../../../core/notification/notification_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 🔔 KHỞI TẠO local notifications + timezone
  await AppNotificationService.I.init();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthViewModel()),
        ChangeNotifierProxyProvider<AuthViewModel, ScheduleViewModel>(
          create: (_) => ScheduleViewModel(""),
          update: (_, authVM, __) {
            final token = authVM.user?.token ?? "";
            return ScheduleViewModel(token);
          },
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TLU Schedule Pro',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/schedule': (context) => const ScheduleScreen(),
      },
    );
  }
}
