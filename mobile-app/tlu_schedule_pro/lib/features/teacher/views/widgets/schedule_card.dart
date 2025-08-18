import 'package:flutter/material.dart';
import '../../models/schedule_model.dart';

class ScheduleCard extends StatelessWidget {
  final ScheduleModel item;
  const ScheduleCard({super.key, required this.item});

  Color get statusColor {
    switch (item.status) {
      case ScheduleStatus.ongoing:
        return const Color(0xFF2F6BFF); // xanh
      case ScheduleStatus.upcoming:
        return const Color(0xFFFFA726); // cam
      case ScheduleStatus.done:
        return const Color(0xFF43A047); // xanh lá
      case ScheduleStatus.canceled:
        return const Color(0xFFE53935); // đỏ
      default:
        return Colors.grey;
    }
  }

  String get statusLabel {
    switch (item.status) {
      case ScheduleStatus.ongoing:
        return 'ĐANG DIỄN RA';
      case ScheduleStatus.upcoming:
        return 'SẮP DIỄN RA';
      case ScheduleStatus.done:
        return 'HOÀN THÀNH';
      case ScheduleStatus.canceled:
        return 'NGHỈ DẠY';
      default:
        return '';
    }
  }

  Widget _chip(String text, Color fg, Color bg) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
    decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
    child: Text(text, style: TextStyle(color: fg, fontWeight: FontWeight.w700, fontSize: 12)),
  );

  @override
  Widget build(BuildContext context) {
    // Header: "Tiết X → Y (hh:mm - hh:mm)" hoặc periodText
    final header = item.timeRange.isNotEmpty
        ? 'Tiết ${item.periodStart} → ${item.periodEnd} (${item.timeRange})'
        : item.periodText;

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.black12),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(.05), blurRadius: 8, offset: const Offset(0, 4)),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // vạch màu trái
            Container(
              width: 6,
              decoration: BoxDecoration(
                color: statusColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(12),
                  bottomLeft: Radius.circular(12),
                ),
              ),
            ),
            // nội dung
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(12, 12, 12, 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Row(
                      children: <Widget>[
                        Text(
                          header,
                          style: TextStyle(color: statusColor, fontWeight: FontWeight.w700),
                        ),
                        const Spacer(),
                        if (statusLabel.isNotEmpty)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: statusColor.withOpacity(.12),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              statusLabel,
                              style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.w700),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    Text(item.subjectName,
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                    const SizedBox(height: 4),
                    Text(item.classCode, style: const TextStyle(color: Colors.grey)),
                    const SizedBox(height: 8),

                    Row(children: <Widget>[
                      const Icon(Icons.location_on_outlined, size: 16),
                      const SizedBox(width: 4),
                      Text(item.roomName),
                      const SizedBox(width: 14),
                      const Icon(Icons.menu_book_outlined, size: 16),
                      const SizedBox(width: 4),
                      Text(item.type),
                    ]),

                    if (item.chapter != null && item.chapter!.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      Row(children: <Widget>[
                        const Icon(Icons.notes_outlined, size: 16),
                        const SizedBox(width: 4),
                        Expanded(child: Text(item.chapter!)),
                      ]),
                    ],

                    const SizedBox(height: 10),

                    // 2 nút hành động: Hoàn thành / Nghỉ dạy
                    Row(
                      children: [
                        _chip('Hoàn thành', const Color(0xFF2E7D32), const Color(0xFFE2F3E6)),
                        const SizedBox(width: 10),
                        _chip('Nghỉ dạy', const Color(0xFFF29900), const Color(0xFFFFF1D9)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
