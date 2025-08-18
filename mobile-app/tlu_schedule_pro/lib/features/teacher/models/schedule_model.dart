// lib/features/teacher/models/schedule_model.dart
import '../../../core/extensions/extensions.dart';

enum ScheduleStatus { upcoming, ongoing, done, canceled, unknown }

class ScheduleModel {
  final DateTime? teachingDate;

  final String? periodStartRaw; // "Tiết 1"
  final String? periodEndRaw;   // "Tiết 3"

  final int periodStart;        // 1
  final int periodEnd;          // 3

  final String type;            // "Lý thuyết" | "Thực hành"
  final String subjectName;     // Tên môn
  final String classCode;       // Mã lớp, vd: 64KTPM3
  final String roomName;        // Phòng
  final String? chapter;        // tuỳ backend
  final ScheduleStatus status;

  const ScheduleModel({
    required this.teachingDate,
    required this.periodStartRaw,
    required this.periodEndRaw,
    required this.periodStart,
    required this.periodEnd,
    required this.type,
    required this.subjectName,
    required this.classCode,
    required this.roomName,
    required this.chapter,
    required this.status,
  });

  // "Tiết 1 – Tiết 3" (ưu tiên dùng raw nếu có)
  String get periodText {
    final a = periodStartRaw;
    final b = periodEndRaw;
    if ((a ?? '').isNotEmpty && (b ?? '').isNotEmpty) return '$a – $b';
    if (periodStart > 0 && periodEnd > 0) return 'Tiết $periodStart – Tiết $periodEnd';
    return '- – -';
  }

  // "07:00 - 09:40"
  String get timeRange {
    if (periodStart <= 0 || periodEnd <= 0) return '';
    return periodTimeRange(periodStart, periodEnd);
  }

  // "dd/MM/yyyy"
  String get dateText => teachingDate == null ? '' : formatDdMMyyyy(teachingDate!);

  int get periodsCount =>
      (periodStart > 0 && periodEnd >= periodStart) ? (periodEnd - periodStart + 1) : 1;

  // ========== Factory từ JSON đã "phẳng" ==========
  factory ScheduleModel.fromJson(Map<String, dynamic> json) {
    DateTime? parseDate(String? s) {
      if (s == null || s.isEmpty) return null;
      final iso = DateTime.tryParse(s);
      if (iso != null) return iso;
      final m = RegExp(r'^(\d{2})/(\d{2})/(\d{4})$').firstMatch(s);
      if (m != null) {
        return DateTime(int.parse(m.group(3)!), int.parse(m.group(2)!), int.parse(m.group(1)!));
      }
      return null;
    }

    final date = parseDate(json['teachingDate']?.toString());
    final psRaw = json['periodStart']?.toString();
    final peRaw = json['periodEnd']?.toString();
    final ps    = extractPeriodNumber(psRaw ?? json['periodStart']?.toString());
    final pe    = extractPeriodNumber(peRaw ?? json['periodEnd']?.toString());

    final subject   = (json['subjectName'] ?? '').toString();
    final classCode = (json['classCode'] ?? '').toString();
    final room      = (json['roomName'] ?? '').toString();
    final type      = (json['type'] ?? '').toString();
    final chapter   = json['chapter']?.toString();

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    ScheduleStatus st;
    if (date == null) {
      st = ScheduleStatus.unknown;
    } else {
      final d = DateTime(date.year, date.month, date.day);
      if (d.isBefore(today)) st = ScheduleStatus.done;
      else if (d.isAfter(today)) st = ScheduleStatus.upcoming;
      else st = ScheduleStatus.upcoming;
    }

    return ScheduleModel(
      teachingDate: date,
      periodStartRaw: psRaw,
      periodEndRaw: peRaw,
      periodStart: ps,
      periodEnd: pe,
      type: type,
      subjectName: subject,
      classCode: classCode,
      roomName: room,
      chapter: chapter,
      status: st,
    );
  }

  // ========== Factory đúng mẫu JSON của bạn (section + detail) ==========
  factory ScheduleModel.fromSectionDetail({
    required Map<String, dynamic> section,
    required Map<String, dynamic> detail,
  }) {
    final subject   = (section['subject']?['name'] ?? '').toString();
    final classCode = (section['name'] ?? '').toString();
    final room      = (section['room']?['name'] ?? '').toString();
    final type      = (detail['type'] ?? '').toString();

    DateTime? parseDate(String? s) {
      if (s == null || s.isEmpty) return null;
      final iso = DateTime.tryParse(s);
      if (iso != null) return iso;
      final m = RegExp(r'^(\d{2})/(\d{2})/(\d{4})$').firstMatch(s);
      if (m != null) {
        return DateTime(int.parse(m.group(3)!), int.parse(m.group(2)!), int.parse(m.group(1)!));
      }
      return null;
    }

    final date = parseDate(detail['teachingDate']?.toString());
    final psRaw = detail['periodStart']?.toString();
    final peRaw = detail['periodEnd']?.toString();
    final ps    = extractPeriodNumber(psRaw);
    final pe    = extractPeriodNumber(peRaw);

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    ScheduleStatus st;
    if (date == null) {
      st = ScheduleStatus.unknown;
    } else {
      final d = DateTime(date.year, date.month, date.day);
      if (d.isBefore(today)) st = ScheduleStatus.done;
      else if (d.isAfter(today)) st = ScheduleStatus.upcoming;
      else st = ScheduleStatus.upcoming;
    }

    return ScheduleModel(
      teachingDate: date,
      periodStartRaw: psRaw,
      periodEndRaw: peRaw,
      periodStart: ps,
      periodEnd: pe,
      type: type,
      subjectName: subject,
      classCode: classCode,
      roomName: room,
      chapter: null,
      status: st,
    );
  }
}
