import 'package:flutter/material.dart';
import '../../models/schedule_model.dart';
import 'schedule_status_badge.dart';

class ScheduleCard extends StatelessWidget {
  final ScheduleModel schedule;
  const ScheduleCard({super.key, required this.schedule});

  @override
  Widget build(BuildContext context) {
    final Color accent = switch (schedule.status) {
      ScheduleStatus.ongoing  => Colors.blue,
      ScheduleStatus.upcoming => Colors.orange,
      ScheduleStatus.finished => Colors.green,
      ScheduleStatus.canceled => Colors.red,
    };

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 0.8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Dòng 1: Tiết + badge
            Row(
              children: [
                Text(schedule.periodLabel,
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(
                      color: accent,
                      fontWeight: FontWeight.w700,
                    )),
                const Spacer(),
                ScheduleStatusBadge(status: schedule.status),
              ],
            ),
            const SizedBox(height: 8),

            // Tên môn + mã lớp
            Text(
              schedule.courseName,
              style: Theme.of(context)
                  .textTheme
                  .titleSmall
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 2),
            Text(
              schedule.classCode,
              style: Theme.of(context)
                  .textTheme
                  .labelSmall
                  ?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),

            // Phòng + Chương
            Row(
              children: [
                const Icon(Icons.location_on_outlined, size: 16),
                const SizedBox(width: 6),
                Text(schedule.room,
                    style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              children: [
                const Icon(Icons.menu_book_outlined, size: 16),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(schedule.chapter,
                      style: Theme.of(context).textTheme.bodySmall),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Các tag trạng thái phụ (ví dụ)
            Wrap(
              spacing: 8,
              children: [
                _chip('Hoàn thành', Icons.check_circle, Colors.green),
                _chip('Nghỉ dạy', Icons.no_backpack_outlined, Colors.red),
                _chip('Ngày dạy', Icons.event_available, Colors.orange),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _chip(String text, IconData icon, Color color) {
    return Chip(
      avatar: Icon(icon, size: 16, color: color),
      label: Text(text),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      side: BorderSide.none,
    );
  }
}
