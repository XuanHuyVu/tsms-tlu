import 'package:flutter/material.dart';
import '../../models/schedule_model.dart';

class ScheduleStatusBadge extends StatelessWidget {
  final ScheduleStatus status;
  const ScheduleStatusBadge({super.key, required this.status});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: status.color.withOpacity(.12),
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