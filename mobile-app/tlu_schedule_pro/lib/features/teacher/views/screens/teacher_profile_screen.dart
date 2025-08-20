// lib/features/teacher/screens/teacher_profile_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/teacher_profile_viewmodel.dart';

class TeacherProfileScreen extends StatelessWidget {
  const TeacherProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Hồ sơ giảng viên")),
      body: ChangeNotifierProvider(
        create: (_) => TeacherProfileViewModel()..fetchProfile(),
        child: Consumer<TeacherProfileViewModel>(
          builder: (context, vm, child) {
            if (vm.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            if (vm.error != null) {
              return Center(child: Text("Lỗi: ${vm.error}"));
            }

            final profile = vm.profile;
            if (profile == null) {
              return const Center(child: Text("Không có dữ liệu"));
            }

            return Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildInfoItem("Mã GV:", profile.teacherCode),
                  _buildInfoItem("Họ tên:", profile.fullName),
                  _buildInfoItem("Giới tính:", profile.gender),
                  _buildInfoItem("Email:", profile.email),
                  _buildInfoItem("Ngày sinh:", _formatDate(profile.dateOfBirth)),
                  _buildInfoItem("SĐT:", profile.phoneNumber),
                  _buildInfoItem("Bộ môn:", profile.department?.name ?? ''),
                  _buildInfoItem("Khoa:", profile.faculty?.name ?? ''),
                  _buildInfoItem("Trạng thái:", profile.status),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildInfoItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return "${date.day}/${date.month}/${date.year}";
  }
}