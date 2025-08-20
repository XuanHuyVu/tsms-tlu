import 'package:flutter/material.dart';
import '../../models/schedule_model.dart';

class ScheduleCard extends StatelessWidget {
  final ScheduleModel item;
  const ScheduleCard({super.key, required this.item});

  /// Parse "HH:mm - HH:mm" -> (start, end) theo ngày hôm nay. Trả về null nếu không parse được
  (DateTime, DateTime)? _parseTodayRange() {
    final tr = (item.timeRange).trim();
    final reg = RegExp(r'(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})');
    final m = reg.firstMatch(tr);
    if (m == null) return null;
    final now = DateTime.now();
    final sh = int.parse(m.group(1)!);
    final sm = int.parse(m.group(2)!);
    final eh = int.parse(m.group(3)!);
    final em = int.parse(m.group(4)!);
    final start = DateTime(now.year, now.month, now.day, sh, sm);
    final end = DateTime(now.year, now.month, now.day, eh, em);
    return (start, end);
  }

  /// Trạng thái hiển thị tính theo thời gian thực và item.status
  ScheduleStatus get effectiveStatus {
    // Ưu tiên các trạng thái kết thúc/bỏ dạy do người dùng thao tác
    if (item.status == ScheduleStatus.done) return ScheduleStatus.done;
    if (item.status == ScheduleStatus.canceled) return ScheduleStatus.canceled;

    final range = _parseTodayRange();
    if (range == null) {
      // không parse được thì giữ nguyên nếu có, mặc định xem như sắp diễn ra
      return item.status == ScheduleStatus.unknown
          ? ScheduleStatus.upcoming
          : item.status;
    }

    final (start, end) = range;
    final now = DateTime.now();

    if (now.isBefore(start)) return ScheduleStatus.upcoming;

    // Trong giờ HOẶC đã qua giờ kết thúc: vẫn hiển thị ĐANG DIỄN RA
    if (now.isAfter(start) || now.isAtSameMomentAs(start)) {
      return ScheduleStatus.ongoing;
    }

    return ScheduleStatus.upcoming; // fallback
  }

  Color get statusColor {
    switch (effectiveStatus) {
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
    switch (effectiveStatus) {
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
    decoration:
    BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
    child: Text(text,
        style: TextStyle(
            color: fg, fontWeight: FontWeight.w700, fontSize: 12)),
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
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 8,
              offset: const Offset(0, 4)),
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
                        Text(header,
                            style: TextStyle(
                                color: statusColor,
                                fontWeight: FontWeight.w700)),
                        const Spacer(),
                        if (statusLabel.isNotEmpty)
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: statusColor.withValues(alpha: .12),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              statusLabel,
                              style: TextStyle(
                                  color: statusColor,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    Text(item.subjectName,
                        style: const TextStyle(
                            fontWeight: FontWeight.w800, fontSize: 16)),
                    const SizedBox(height: 4),
                    Text(item.classCode,
                        style: const TextStyle(color: Colors.grey)),
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

                    // 2 nút hành động (hiện tại là UI demo)
                    Row(
                      children: [
                        _chip('Hoàn thành', const Color(0xFF2E7D32),
                            const Color(0xFFE2F3E6)),
                        const SizedBox(width: 10),
                        _chip('Nghỉ dạy', const Color(0xFFF29900),
                            const Color(0xFFFFF1D9)),
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
