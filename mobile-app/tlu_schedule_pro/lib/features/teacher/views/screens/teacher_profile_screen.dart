import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/teacher_profile_viewmodel.dart';
import '../../models/teacher_profile_model.dart';

class TeacherProfileScreen extends StatefulWidget {
  final int teacherId;
  const TeacherProfileScreen({Key? key, required this.teacherId}) : super(key: key);

  @override
  State<TeacherProfileScreen> createState() => _TeacherProfileScreenState();
}

class _TeacherProfileScreenState extends State<TeacherProfileScreen> {
  @override
  void initState() {
    super.initState();
    if (widget.teacherId > 0) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        context.read<TeacherProfileViewModel>().fetchProfile(widget.teacherId);
      });
    }
  }

  @override
  void didUpdateWidget(covariant TeacherProfileScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.teacherId != oldWidget.teacherId && widget.teacherId > 0) {
      context.read<TeacherProfileViewModel>().fetchProfile(widget.teacherId);
    }
  }

  @override
  Widget build(BuildContext context) {
    final vm = context.watch<TeacherProfileViewModel>();

    return Scaffold(
      appBar: AppBar(title: const Text("Hồ sơ giảng viên")),
      body: vm.isLoading
          ? const Center(child: CircularProgressIndicator())
          : vm.errorMessage != null
          ? Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text("Lỗi: ${vm.errorMessage}"),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () => context
                  .read<TeacherProfileViewModel>()
                  .fetchProfile(widget.teacherId),
              child: const Text('Thử lại'),
            ),
          ],
        ),
      )
          : vm.profile == null
          ? const Center(child: Text("Không có dữ liệu"))
          : _buildProfileView(vm.profile!),
    );
  }

  // -------- Helpers: Trích dữ liệu từ model bất kể tên field ----------
  Map<String, dynamic> _asMap(Object obj) {
    try {
      final dynamic d = obj; // ignore: avoid_dynamic_calls
      final m = d.toJson() as Map<String, dynamic>;
      return m;
    } catch (_) {
      return <String, dynamic>{};
    }
  }

  String _pick(Map<String, dynamic> m, List<String> keys, {String fallback = ''}) {
    for (final k in keys) {
      final v = m[k];
      if (v != null && v.toString().trim().isNotEmpty) return v.toString();
    }
    return fallback;
  }

  Widget _buildProfileView(TeacherProfile profile) {
    final map = _asMap(profile);

    final avatarUrl = _pick(
      map,
      ['avatarUrl', 'avatar', 'imageUrl', 'photo', 'photoUrl'],
    );
    final name = _pick(map, ['name', 'fullName', 'displayName'], fallback: 'Giảng viên');
    final email = _pick(map, ['email', 'mail'], fallback: '');
    final phone = _pick(map, ['phone', 'phoneNumber', 'mobile'], fallback: '');
    final faculty = _pick(map, ['faculty', 'facultyName'], fallback: '');
    final department = _pick(map, ['department', 'departmentName'], fallback: '');

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          CircleAvatar(
            radius: 50,
            backgroundImage: avatarUrl.isNotEmpty
                ? NetworkImage(avatarUrl)
                : const AssetImage("assets/images/default_avatar.png") as ImageProvider,
          ),
          const SizedBox(height: 16),
          Text(name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          _buildInfoRow("Email", email),
          _buildInfoRow("Số điện thoại", phone),
          _buildInfoRow("Khoa", faculty),
          _buildInfoRow("Bộ môn", department),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              // TODO: mở màn hình sửa hồ sơ
            },
            child: const Text("Chỉnh sửa hồ sơ"),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Text("$label: ", style: const TextStyle(fontWeight: FontWeight.bold)),
          Expanded(child: Text(value.isEmpty ? '-' : value)),
        ],
      ),
    );
  }
}
