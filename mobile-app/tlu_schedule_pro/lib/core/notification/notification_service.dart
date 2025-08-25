import 'dart:io' show Platform;
import 'package:flutter/services.dart';
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
      _channelId,
      _channelName,
      description: _channelDesc,
      importance: Importance.high,
    );

    await _fln
        .resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(androidChannel);

    // Android 13+: xin quyền POST_NOTIFICATIONS
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
      const NotificationDetails(
        android: AndroidNotificationDetails(
          _channelId,
          _channelName,
          channelDescription: _channelDesc,
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: DarwinNotificationDetails(),
      ),
    );
  }

  /// Lên lịch nhắc trước [before] (mặc định 15')
  /// Dùng INEXACT để không cần quyền SCHEDULE_EXACT_ALARM trên Android 12+.
  Future<void> scheduleReminderBefore({
    required int scheduleId,
    required String title,
    required String body,
    required DateTime classStartLocal,
    Duration before = const Duration(minutes: 15),
  }) async {
    await init();

    final fireAt = classStartLocal.subtract(before);
    if (fireAt.isBefore(DateTime.now())) {
      // Quá giờ thì bỏ qua
      return;
    }

    final tzTime = tz.TZDateTime.from(fireAt, tz.local);

    try {
      await _fln.zonedSchedule(
        scheduleId,
        title,
        body,
        tzTime,
        const NotificationDetails(
          android: AndroidNotificationDetails(
            _channelId,
            _channelName,
            channelDescription: _channelDesc,
            importance: Importance.high,
            priority: Priority.high,
          ),
          iOS: DarwinNotificationDetails(),
        ),
        // 🔑 Không dùng exact để tránh lỗi exact_alarms_not_permitted
        androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
        uiLocalNotificationDateInterpretation:
        UILocalNotificationDateInterpretation.absoluteTime,
        payload: 'schedule-$scheduleId',
      );
    } on PlatformException catch (e) {
      // Nếu vẫn lỗi (thiết bị đặc thù), đừng làm app crash
      // Có thể fallback: nếu còn < 1 phút tới giờ thì show ngay
      final secs = fireAt.difference(DateTime.now()).inSeconds;
      if (secs >= 0 && secs <= 60) {
        await showNow(id: scheduleId, title: title, body: body);
      }
      // (tuỳ ý) log e.code/e.message nếu bạn có hệ thống log
    }
  }

  Future<void> cancel(int id) async {
    await _fln.cancel(id);
  }

  Future<void> cancelAll() async {
    await _fln.cancelAll();
  }
}
