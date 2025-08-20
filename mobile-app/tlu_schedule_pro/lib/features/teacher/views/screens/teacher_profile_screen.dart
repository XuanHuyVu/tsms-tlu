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

  Widget _buildProfileView(TeacherProfile profile) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          CircleAvatar(
            radius: 50,
            backgroundImage: profile.avatarUrl.isNotEmpty
                ? NetworkImage(profile.avatarUrl)
                : const AssetImage("assets/images/default_avatar.png") as ImageProvider,
          ),
          const SizedBox(height: 16),
          Text(profile.name,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          _buildInfoRow("Email", profile.email),
          _buildInfoRow("Số điện thoại", profile.phone),
          _buildInfoRow("Khoa", profile.faculty),
          _buildInfoRow("Bộ môn", profile.department),
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
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
