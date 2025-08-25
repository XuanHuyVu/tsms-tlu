import 'dart:io' show Platform;
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'timezone_helper.dart';

class AppNotificationService {
  AppNotificationService._();
  static final AppNotificationService I = AppNotificationService._();

  final _fln = FlutterLocalNotificationsPlugin();
  bool _inited = false;

  static const _channelId = 'tlu_schedule_channel';
  static const _channelName = 'Lịch dạy';
  static const _channelDesc = 'Nhắc lịch dạy và thông báo trạng thái';

  Future<void> init() async {
    if (_inited) return;
    await TimezoneHelper.ensureInitialized();

    // Android init
    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');

    // iOS init
    const iosInit = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const settings = InitializationSettings(
      android: androidInit,
      iOS: iosInit,
    );

    await _fln.initialize(settings);

    // Android: tạo kênh
    const androidChannel = AndroidNotificationChannel(
      _channelId, _channelName,
      description: _channelDesc,
      importance: Importance.high,
    );

    await _fln
        .resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(androidChannel);

    // Android 13+: nên xin quyền (ở iOS đã xin trong iosInit)
    if (Platform.isAndroid) {
      final impl = _fln.resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>();
      await impl?.requestNotificationsPermission();
    }

    _inited = true;
  }

  /// Hiển thị thông báo ngay (khi bấm Hoàn thành)
  Future<void> showNow({
    required String title,
    required String body,
    int id = 1000,
  }) async {
    await init();
    await _fln.show(
      id,
      title,
      body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          _channelId, _channelName,
          channelDescription: _channelDesc,
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: const DarwinNotificationDetails(),
      ),
    );
  }

  /// Lên lịch nhắc trước 15 phút
  /// [scheduleId] dùng làm unique id để có thể cancel/update nếu cần.
  Future<void> scheduleReminderBefore({
    required int scheduleId,
    required String title,
    required String body,
    required DateTime classStartLocal,
    Duration before = const Duration(minutes: 15),
    bool allowWhileIdle = true,
  }) async {
    await init();

    final fireAt = classStartLocal.subtract(before);
    if (fireAt.isBefore(DateTime.now())) {
      // Quá giờ thì bỏ qua
      return;
    }

    final tzTime = tz.TZDateTime.from(fireAt, tz.local);

    await _fln.zonedSchedule(
      scheduleId, // ID duy nhất cho mỗi buổi dạy
      title,
      body,
      tzTime,
      NotificationDetails(
        android: AndroidNotificationDetails(
          _channelId, _channelName,
          channelDescription: _channelDesc,
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: const DarwinNotificationDetails(),
      ),
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
      UILocalNotificationDateInterpretation.absoluteTime,
      matchDateTimeComponents: null,
      payload: 'schedule-$scheduleId',
    );
  }

  Future<void> cancel(int id) async {
    await _fln.cancel(id);
  }

  Future<void> cancelAll() async {
    await _fln.cancelAll();
  }
}
