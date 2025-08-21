// lib/features/teacher/models/schedule_model.dart
import '../../../core/extensions/extensions.dart';

enum ScheduleStatus { upcoming, ongoing, done, canceled, unknown }

// ===== Helpers map status <-> API =====
ScheduleStatus statusFromApi(String? s) {
  switch ((s ?? '').toUpperCase()) {
    case 'DA_DAY':
    case 'DONE':
      return ScheduleStatus.done;
    case 'NGHI_DAY':
    case 'CANCELED':
      return ScheduleStatus.canceled;
    case 'DANG_DAY':
    case 'ONGOING':
      return ScheduleStatus.ongoing;
    case 'SAP_DAY':
    case 'UPCOMING':
      return ScheduleStatus.upcoming;
    default:
      return ScheduleStatus.unknown;
  }
}

String statusToApi(ScheduleStatus s) {
  switch (s) {
    case ScheduleStatus.done:
      return 'DA_DAY';
    case ScheduleStatus.canceled:
      return 'NGHI_DAY';
    case ScheduleStatus.ongoing:
      return 'DANG_DAY';
    case ScheduleStatus.upcoming:
      return 'SAP_DAY';
    default:
      return 'UNKNOWN';
  }
}

class ScheduleModel {
  // 🔹 Thêm id để thao tác API theo từng lịch (ví dụ /details/{id}/attendance)
  final int id;

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
    required this.id,
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

  // ===== Common parsing =====
  static DateTime? _parseDateFlexible(String? s) {
    if (s == null || s.isEmpty) return null;
    final iso = DateTime.tryParse(s);
    if (iso != null) return iso;
    final m = RegExp(r'^(\d{2})/(\d{2})/(\d{4})$').firstMatch(s);
    if (m != null) {
      return DateTime(
        int.parse(m.group(3)!),
        int.parse(m.group(2)!),
        int.parse(m.group(1)!),
      );
    }
    return null;
  }

  static int _toInt(dynamic v) {
    if (v == null) return 0;
    if (v is int) return v;
    return int.tryParse(v.toString()) ?? 0;
  }

  // Fallback status theo ngày nếu API không có status
  static ScheduleStatus _fallbackStatusByDate(DateTime? date) {
    if (date == null) return ScheduleStatus.unknown;
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final d = DateTime(date.year, date.month, date.day);
    if (d.isBefore(today)) return ScheduleStatus.done;
    if (d.isAfter(today)) return ScheduleStatus.upcoming;
    return ScheduleStatus.upcoming;
  }

  // ========== Factory từ JSON đã "phẳng" ==========
  factory ScheduleModel.fromJson(Map<String, dynamic> json) {
    final date = _parseDateFlexible(json['teachingDate']?.toString());
    final psRaw = json['periodStart']?.toString();
    final peRaw = json['periodEnd']?.toString();
    final ps    = extractPeriodNumber(psRaw ?? json['periodStart']?.toString());
    final pe    = extractPeriodNumber(peRaw ?? json['periodEnd']?.toString());

    final subject   = (json['subjectName'] ?? '').toString();
    final classCode = (json['classCode'] ?? '').toString();
    final room      = (json['roomName'] ?? '').toString();
    final type      = (json['type'] ?? '').toString();
    final chapter   = json['chapter']?.toString();

    // 🔹 id có thể là 'id' hoặc 'detailId' tuỳ backend
    final id        = _toInt(json['id'] ?? json['detailId']);

    // Ưu tiên status từ API; nếu không có thì fallback theo ngày
    final stApi     = statusFromApi(json['status'] as String?);
    final st        = stApi == ScheduleStatus.unknown
        ? _fallbackStatusByDate(date)
        : stApi;

    return ScheduleModel(
      id: id,
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

    final date  = _parseDateFlexible(detail['teachingDate']?.toString());
    final psRaw = detail['periodStart']?.toString();
    final peRaw = detail['periodEnd']?.toString();
    final ps    = extractPeriodNumber(psRaw);
    final pe    = extractPeriodNumber(peRaw);

    final id    = _toInt(detail['id']); // 🔹 id detail theo payload bạn đưa

    final stApi = statusFromApi(detail['status'] as String?);
    final st    = stApi == ScheduleStatus.unknown
        ? _fallbackStatusByDate(date)
        : stApi;

    return ScheduleModel(
      id: id,
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

  // ===== tiện cho cập nhật trong ViewModel
  ScheduleModel copyWith({
    int? id,
    DateTime? teachingDate,
    String? periodStartRaw,
    String? periodEndRaw,
    int? periodStart,
    int? periodEnd,
    String? type,
    String? subjectName,
    String? classCode,
    String? roomName,
    String? chapter,
    ScheduleStatus? status,
  }) {
    return ScheduleModel(
      id: id ?? this.id,
      teachingDate: teachingDate ?? this.teachingDate,
      periodStartRaw: periodStartRaw ?? this.periodStartRaw,
      periodEndRaw: periodEndRaw ?? this.periodEndRaw,
      periodStart: periodStart ?? this.periodStart,
      periodEnd: periodEnd ?? this.periodEnd,
      type: type ?? this.type,
      subjectName: subjectName ?? this.subjectName,
      classCode: classCode ?? this.classCode,
      roomName: roomName ?? this.roomName,
      chapter: chapter ?? this.chapter,
      status: status ?? this.status,
    );
  }
}
