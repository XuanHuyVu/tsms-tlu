import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/teacher_profile_viewmodel.dart';

class TeacherProfileScreen extends StatelessWidget {
  final String token; // Truyền token khi login

  const TeacherProfileScreen({super.key, required this.token});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => TeacherProfileViewModel()..getTeacherProfile(token),
      child: Consumer<TeacherProfileViewModel>(
        builder: (context, viewModel, child) {
          if (viewModel.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (viewModel.teacherProfile == null) {
            return const Center(child: Text("Không tải được dữ liệu"));
          }

          final profile = viewModel.teacherProfile!;
          return Scaffold(
            appBar: AppBar(
              title: const Text("Hồ sơ giảng viên"),
              actions: [
                TextButton(
                  onPressed: () {
                    // TODO: logout xử lý sau
                  },
                  child: const Text("Đăng xuất", style: TextStyle(color: Colors.red)),
                )
              ],
            ),
            body: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Header (ảnh + tên + khoa)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.blue,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        const CircleAvatar(
                          radius: 40,
                          backgroundImage: AssetImage("assets/avatar.png"), // thay avatar
                        ),
                        const SizedBox(height: 8),
                        Text(
                          profile.fullName,
                          style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          profile.facultyName,
                          style: const TextStyle(color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Thông tin cá nhân
                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        children: [
                          _buildInfoRow(Icons.email, "Email", profile.email),
                          _buildInfoRow(Icons.cake, "Ngày sinh", profile.dateOfBirth),
                          _buildInfoRow(Icons.phone, "SĐT", profile.phoneNumber),
                          _buildInfoRow(Icons.male, "Giới tính", profile.gender),
                          _buildInfoRow(Icons.badge, "Mã GV", profile.teacherCode),
                          _buildInfoRow(Icons.school, "Bộ môn", profile.departmentName),
                          _buildInfoRow(Icons.check_circle, "Trạng thái", profile.status),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Cài đặt
                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: Column(
                      children: const [
                        ListTile(
                          leading: Icon(Icons.settings),
                          title: Text("Cài đặt tài khoản"),
                        ),
                        Divider(),
                        ListTile(
                          leading: Icon(Icons.help_outline),
                          title: Text("Trợ giúp"),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, color: Colors.blue),
          const SizedBox(width: 10),
          Expanded(
            child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          ),
          Expanded(
            child: Text(value, textAlign: TextAlign.right),
          ),
        ],
      ),
    );
  }
}
