import 'package:flutter/material.dart';
import '../../models/schedule_model.dart';

class ScheduleCard extends StatelessWidget {
  final ScheduleModel item;
  final Future<void> Function()? onMarkDone;

  const ScheduleCard({
    super.key,
    required this.item,
    this.onMarkDone,
  });

  // ---------------- Dialog helper ----------------
  Future<void> _showCustomDialog(
      BuildContext context, {
        required String title,
        required String message,
        required Color titleColor,
        IconData? icon,
        Color? iconColor,
      }) async {
    await showDialog<void>(
      context: context,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null)
                Icon(icon, size: 48, color: iconColor ?? titleColor),
              if (icon != null) const SizedBox(height: 16),
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: titleColor,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                message,
                style: const TextStyle(fontSize: 14),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: titleColor,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('OK'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // --------------- Time helpers ---------------
  bool _isSameDay(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  /// Parse "HH:mm - HH:mm" -> (start, end) theo NGÀY `baseDate`
  (DateTime, DateTime)? _parseRangeForDate(DateTime baseDate) {
    final tr = (item.timeRange).trim();
    final reg = RegExp(r'(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})');
    final m = reg.firstMatch(tr);
    if (m == null) return null;

    final sh = int.parse(m.group(1)!);
    final sm = int.parse(m.group(2)!);
    final eh = int.parse(m.group(3)!);
    final em = int.parse(m.group(4)!);

    final start =
    DateTime(baseDate.year, baseDate.month, baseDate.day, sh, sm);
    final end = DateTime(baseDate.year, baseDate.month, baseDate.day, eh, em);
    return (start, end);
  }

  /// Trạng thái hiển thị tính theo thời gian thực + item.status
  ScheduleStatus get effectiveStatus {
    // Ưu tiên trạng thái đã chốt
    if (item.status == ScheduleStatus.done) return ScheduleStatus.done;
    if (item.status == ScheduleStatus.canceled) return ScheduleStatus.canceled;

    final now = DateTime.now();
    final d = item.teachingDate;
    if (d == null) {
      return item.status == ScheduleStatus.unknown
          ? ScheduleStatus.upcoming
          : item.status;
    }

    final today = DateTime(now.year, now.month, now.day);
    final thatDay = DateTime(d.year, d.month, d.day);

    // Khác ngày hôm nay
    if (!_isSameDay(today, thatDay)) {
      if (thatDay.isAfter(today)) return ScheduleStatus.upcoming; // tương lai
      return item.status; // quá khứ: giữ status (thường là done)
    }

    // ĐÚNG ngày hôm nay -> xét theo giờ
    final range = _parseRangeForDate(today);
    if (range == null) {
      return item.status == ScheduleStatus.unknown
          ? ScheduleStatus.upcoming
          : item.status;
    }
    final (start, end) = range;

    if (now.isBefore(start)) return ScheduleStatus.upcoming;
    if (now.isAfter(end)) return item.status; // qua giờ: giữ status hiện có
    return ScheduleStatus.ongoing; // trong giờ
  }

  Color get statusColor {
    switch (effectiveStatus) {
      case ScheduleStatus.ongoing:
        return const Color(0xFF2F6BFF);
      case ScheduleStatus.upcoming:
        return const Color(0xFFFFA726);
      case ScheduleStatus.done:
        return const Color(0xFF43A047);
      case ScheduleStatus.canceled:
        return const Color(0xFFE53935);
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

  /// Rule: chỉ trong ĐÚNG NGÀY học, và trong khoảng [end - 60'] .. [end + 60']
  /// Trả về: (ok, reason, windowStart, windowEnd)
  (bool, String?, DateTime?, DateTime?) _canCompleteNow() {
    final now = DateTime.now();
    final d = item.teachingDate;
    if (d == null) return (false, 'Không xác định ngày học.', null, null);

    final today = DateTime(now.year, now.month, now.day);
    final thatDay = DateTime(d.year, d.month, d.day);
    if (!_isSameDay(today, thatDay)) {
      return (
      false,
      'Chỉ có thể đánh dấu trong đúng ngày diễn ra buổi học.',
      null,
      null
      );
    }

    final range = _parseRangeForDate(today);
    if (range == null) {
      return (false, 'Không xác định được khung giờ của buổi học.', null, null);
    }
    final (_, end) = range;

    final windowStart = end.subtract(const Duration(minutes: 60));
    final windowEnd   = end.add(const Duration(minutes: 60));

    if (now.isBefore(windowStart)) {
      return (
      false,
      'Chưa đến thời gian: chỉ được đánh dấu trong 60 phút trước khi kết thúc.',
      windowStart,
      windowEnd
      );
    }
    if (now.isAfter(windowEnd)) {
      return (
      false,
      'Quá thời gian: đã quá 60 phút sau khi kết thúc.',
      windowStart,
      windowEnd
      );
    }
    return (true, null, windowStart, windowEnd);
  }

  String _formatHm(DateTime t) =>
      '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';

  Widget _chipStatic(String text, Color fg, Color bg) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
    decoration:
    BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
    child: Text(
      text,
      style:
      TextStyle(color: fg, fontWeight: FontWeight.w700, fontSize: 12),
    ),
  );

  Widget _chipButton(
      String text,
      Color fg,
      Color bg,
      VoidCallback? onTap,
      ) =>
      InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration:
          BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
          child: Text(
            text,
            style: TextStyle(
                color: fg, fontWeight: FontWeight.w700, fontSize: 12),
          ),
        ),
      );

  @override
  Widget build(BuildContext context) {
    final header = item.timeRange.isNotEmpty
        ? 'Tiết ${item.periodStart} → ${item.periodEnd} (${item.timeRange})'
        : item.periodText;

    final locked =
    (item.status == ScheduleStatus.done || item.status == ScheduleStatus.canceled);

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.black12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
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
                          style: TextStyle(
                            color: statusColor,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const Spacer(),
                        if (statusLabel.isNotEmpty)
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: statusColor.withOpacity(.12),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              statusLabel,
                              style: TextStyle(
                                color: statusColor,
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                              ),
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

                    Row(
                      children: [
                        _chipButton(
                          'Hoàn thành',
                          const Color(0xFF2E7D32),
                          const Color(0xFFE2F3E6),
                          locked
                              ? null
                              : () async {
                            final (ok, reason, from, to) =
                            _canCompleteNow();

                            if (!ok) {
                              var msg = reason ?? 'Không thể cập nhật.';
                              if (from != null && to != null) {
                                msg += '\nCửa sổ cho phép: '
                                    '${_formatHm(from)} → ${_formatHm(to)}';
                              }

                              if (reason?.contains('Chưa đến thời gian') ==
                                  true) {
                                await _showCustomDialog(
                                  context,
                                  title: 'Chưa đến thời gian',
                                  message: msg,
                                  titleColor: const Color(0xFFFFA726),
                                  icon: Icons.access_time,
                                  iconColor: const Color(0xFFFFA726),
                                );
                              } else if (reason
                                  ?.contains('Quá thời gian') ==
                                  true) {
                                await _showCustomDialog(
                                  context,
                                  title: 'Quá thời gian',
                                  message: msg,
                                  titleColor: const Color(0xFFE53935),
                                  icon: Icons.error_outline,
                                  iconColor: const Color(0xFFE53935),
                                );
                              } else if (reason
                                  ?.contains('ngày diễn ra') ==
                                  true) {
                                await _showCustomDialog(
                                  context,
                                  title: 'Không đúng ngày',
                                  message: msg,
                                  titleColor: const Color(0xFFE53935),
                                  icon: Icons.calendar_today,
                                  iconColor: const Color(0xFFE53935),
                                );
                              } else {
                                await _showCustomDialog(
                                  context,
                                  title: 'Không thể hoàn thành',
                                  message: msg,
                                  titleColor: const Color(0xFFE53935),
                                  icon: Icons.error_outline,
                                  iconColor: const Color(0xFFE53935),
                                );
                              }
                              return;
                            }

                            if (onMarkDone == null) return;
                            try {
                              await onMarkDone!();
                              if (!context.mounted) return;
                              await _showCustomDialog(
                                context,
                                title: 'Thành công',
                                message: 'Đã cập nhật: Hoàn thành',
                                titleColor: const Color(0xFF43A047),
                                icon: Icons.check_circle,
                                iconColor: const Color(0xFF43A047),
                              );
                            } catch (e) {
                              if (!context.mounted) return;
                              await _showCustomDialog(
                                context,
                                title: 'Lỗi',
                                message: e.toString(),
                                titleColor: const Color(0xFFE53935),
                                icon: Icons.error_outline,
                                iconColor: const Color(0xFFE53935),
                              );
                            }
                          },
                        ),
                        const SizedBox(width: 10),
                        _chipStatic(
                          'Nghỉ dạy',
                          const Color(0xFFF29900),
                          const Color(0xFFFFF1D9),
                        ),
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
