import 'package:flutter/material.dart';
import '../../models/schedule_model.dart';

class ScheduleStatusBadge extends StatelessWidget {
  final ScheduleStatus status;
  const ScheduleStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    final (label, bg, fg) = switch (status) {
      ScheduleStatus.ongoing  => ('ĐANG DIỄN RA', Colors.blue.shade50, Colors.blue),
      ScheduleStatus.upcoming => ('SẮP DIỄN RA', Colors.orange.shade50, Colors.orange),
      ScheduleStatus.finished => ('HOÀN THÀNH', Colors.green.shade50, Colors.green),
      ScheduleStatus.canceled => ('NGHỈ DẠY', Colors.red.shade50, Colors.red),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(label,
          style: Theme.of(context)
              .textTheme
              .labelSmall
              ?.copyWith(color: fg, fontWeight: FontWeight.w600)),
    );
  }
}
