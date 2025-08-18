// lib/core/constants/constants.dart

/// Tiện ích format ngày YYYY-MM-DD
extension DateX on DateTime {
  String toYMD() {
    final mm = month.toString().padLeft(2, '0');
    final dd = day.toString().padLeft(2, '0');
    return '$year-$mm-$dd';
  }
}

/// Ánh xạ TIẾT -> KHUNG GIỜ
const Map<int, String> tietToTime = {
  1:  "07:00 - 07:50",
  2:  "07:55 - 08:45",
  3:  "08:50 - 09:40",
  4:  "09:45 - 10:35",
  5:  "10:40 - 11:30",
  6:  "11:35 - 12:25",
  7:  "12:55 - 13:45",
  8:  "13:50 - 14:40",
  9:  "14:45 - 15:35",
  10: "15:40 - 16:30",
  11: "16:35 - 17:25",
  12: "17:30 - 18:20",
  13: "18:50 - 19:40",
  14: "19:45 - 20:35",
  15: "20:40 - 21:30",
};

/// Trả về "HH:mm - HH:mm" theo tiết bắt đầu/kết thúc
String periodTimeRange(int start, int end) {
  final s = tietToTime[start];
  final e = tietToTime[end];
  if (s == null || e == null) return "—";
  final startHHmm = s.split(' - ').first;
  final endHHmm   = e.split(' - ').last;
  return "$startHHmm - $endHHmm";
}
