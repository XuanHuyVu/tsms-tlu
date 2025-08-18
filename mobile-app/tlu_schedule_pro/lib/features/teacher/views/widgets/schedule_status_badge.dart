import 'package:flutter/material.dart';
import '../../models/schedule_model.dart';

/// Style helpers for ScheduleStatus
extension ScheduleStatusStyle on ScheduleStatus {
  String get label {
    switch (this) {
      case ScheduleStatus.ongoing:
        return 'ĐANG DIỄN RA';
      case ScheduleStatus.upcoming:
        return 'SẮP DIỄN RA';
      case ScheduleStatus.done:
        return 'HOÀN THÀNH';
      case ScheduleStatus.canceled:
        return 'HUỶ';
      case ScheduleStatus.unknown:
      default:
        return '';
    }
  }

  Color get color {
    switch (this) {
      case ScheduleStatus.ongoing:
        return Colors.blue;
      case ScheduleStatus.upcoming:
        return Colors.orange;
      case ScheduleStatus.done:
        return Colors.green;
      case ScheduleStatus.canceled:
        return Colors.red;
      case ScheduleStatus.unknown:
      default:
        return Colors.grey;
    }
  }
}

class ScheduleStatusBadge extends StatelessWidget {
  final ScheduleStatus status;
  const ScheduleStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        // Flutter mới: withOpacity deprecated -> dùng withValues
        color: status.color.withValues(alpha: 0.12),
        border: Border.all(color: status.color, width: 1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        status.label,
        style: TextStyle(
          color: status.color,
          fontWeight: FontWeight.w700,
          fontSize: 11,
          letterSpacing: .3,
        ),
      ),
    );
  }
}
