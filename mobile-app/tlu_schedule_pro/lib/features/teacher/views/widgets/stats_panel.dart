import 'package:flutter/material.dart';

class StatsPanel extends StatelessWidget {
  final int periodsToday;
  final int periodsThisWeek;
  final int percentCompleted;
  const StatsPanel({
    super.key,
    required this.periodsToday,
    required this.periodsThisWeek,
    required this.percentCompleted,
  });

  static const Color lightBlue = Color(0xFFE8F1FF);
  static const Color textBlue = Color(0xFF2F6BFF);

  Widget _tile(String title, String value) => Expanded(
    child: Container(
      margin: const EdgeInsets.symmetric(horizontal: 4),
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: lightBlue,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 18,
              color: textBlue,
            ),
          ),
          const SizedBox(height: 6),
          Text(title, style: const TextStyle(color: textBlue)),
        ],
      ),
    ),
  );

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _tile('Tiết hôm nay', '$periodsToday'),
        _tile('Tiết tuần này', '$periodsThisWeek'),
        _tile('Hoàn thành', '$percentCompleted%'),
      ],
    );
  }
}
