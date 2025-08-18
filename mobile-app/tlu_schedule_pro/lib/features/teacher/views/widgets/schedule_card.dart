import 'package:flutter/material.dart';
import '../../models/schedule_model.dart';
import 'schedule_status_badge.dart';

class ScheduleCard extends StatelessWidget {
  final ScheduleModel item;
  const ScheduleCard({super.key, required this.item});
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(
          color: item.status == ScheduleStatus.ongoing
              ? const Color(0xFF2F80ED)
              : Colors.transparent,
          width: 1.5,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  item.periodText,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF2F80ED),
                  ),
                ),
                const Spacer(),
                ScheduleStatusBadge(status: item.status),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              item.courseTitle,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
              ),
            ),
            Text(
              '(${item.classCode})',
              style: TextStyle(
                color: Colors.black.withOpacity(.6),
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            _iconText(Icons.room, item.room),
            const SizedBox(height: 6),
            _iconText(Icons.menu_book_rounded, item.chapter),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: item.bottomChips
                  .map((t) => _chip(
                t,
                color: t.toLowerCase().contains('hoàn')
                    ? const Color(0xFF2EB872)
                    : const Color(0xFFF2994A),
              ))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _iconText(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.black.withOpacity(.6)),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
        ),
      ],
    );
  }

  Widget _chip(String text, {required Color color}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w700,
          fontSize: 12,
        ),
      ),
    );
  }
}