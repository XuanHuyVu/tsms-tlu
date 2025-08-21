import 'dart:convert';
import 'package:http/http.dart' as http;

class TeacherScheduleService {
  final String baseUrl;
  final Future<Map<String, String>> Function()? authHeaders;

  TeacherScheduleService({
    this.baseUrl = 'http://10.0.2.2:8080',
    this.authHeaders,
  });

  Future<Map<String, dynamic>> markAsDone(int scheduleId) async {
    final url = Uri.parse(
      '$baseUrl/api/teacher/teaching-schedule-details/$scheduleId/attendance',
    );

    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (authHeaders != null) ...(await authHeaders!()),
    };

    // 🔁 Server không cần body -> để {} cho chắc
    final res = await http.put(url, headers: headers, body: jsonEncode({}));

    print('[PUT] $url -> ${res.statusCode} ${res.body}');
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.body.isEmpty ? <String, dynamic>{} : json.decode(res.body);
    }
    throw Exception('HTTP ${res.statusCode}: ${res.body}');
  }
}
