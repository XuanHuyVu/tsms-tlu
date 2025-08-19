import 'package:flutter/material.dart';
import '../../models/profile_entity.dart';
import '../../services/profile_service.dart';
import 'package:tlu_schedule_pro/features/auth/viewmodels/auth_viewmodel.dart';
import 'package:provider/provider.dart';
import 'package:tlu_schedule_pro/shared/widgets/logout_dialog.dart';
import 'package:tlu_schedule_pro/features/student/views/screens/schedule_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late Future<ProfileEntity> futureProfile;

  @override
  void initState() {
    super.initState();
    futureProfile = ProfileService().fetchProfile();
  }

  String formatDate(String isoDate) {
    try {
      final DateTime parsedDate = DateTime.parse(isoDate);
      return "${parsedDate.day.toString().padLeft(2, '0')}/"
          "${parsedDate.month.toString().padLeft(2, '0')}/"
          "${parsedDate.year}";
    } catch (e) {
      return isoDate;
    }
  }

  Future<void> _logout(BuildContext context) async {
    final shouldLogout = await showLogoutConfirmationDialog(context);
    if (shouldLogout) {
      final authViewModel = Provider.of<AuthViewModel>(context, listen: false);
      await authViewModel.logout();
      Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
    }
  }

  Widget _buildInfoRow(IconData icon, String label, String? value) {
    final displayValue = (value == null || value.trim().isEmpty) ? "Chưa cập nhật" : value;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 8.0),
      child: Row(
        children: [
          Icon(icon, color: Colors.blue.shade700),
          const SizedBox(width: 12),
          Expanded(
            flex: 3,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
            ),
          ),
          Expanded(
            flex: 4,
            child: Text(
              displayValue!,
              style: const TextStyle(fontSize: 15, color: Colors.black87),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOptionCard({
    required IconData icon,
    required String label,
    required Color color,
    VoidCallback? onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        splashColor: color.withValues(alpha: 0.5),
        child: Container(
          width: 100,
          height: 110,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: color.withValues(alpha: 0.15),
                spreadRadius: 1,
                blurRadius: 8,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: color.withValues(alpha: 0.15),
                ),
                padding: const EdgeInsets.all(14),
                child: Icon(icon, size: 36, color: color),
              ),
              const SizedBox(height: 12),
              Text(label,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  )),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<ProfileEntity>(
        future: futureProfile,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Lỗi: ${snapshot.error}"));
          } else if (!snapshot.hasData) {
            return const Center(child: Text("Không có dữ liệu"));
          }

          final user = snapshot.data!;

          return SafeArea(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // Header with gradient and avatar
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.indigo.shade700, Colors.blueAccent.shade400, Colors.lightBlueAccent.shade100],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
                    child: Column(
                      children: [
                        Stack(
                          alignment: Alignment.bottomRight,
                          children: [
                            CircleAvatar(
                              radius: 50,
                              backgroundImage: AssetImage("assets/images/avatar.png"),
                            ),
                            Container(
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white70,
                              ),
                              child: const Padding(
                                padding: EdgeInsets.all(6.0),
                                child: Icon(Icons.school, color: Colors.indigo, size: 30),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          user.fullName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 24,
                            letterSpacing: 0.7,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          "Mã SV: ${user.studentCode}",
                          style: const TextStyle(color: Colors.white70, fontSize: 18),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          user.email ?? "Chưa cập nhật email",
                          style: const TextStyle(color: Colors.white70, fontSize: 16),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 22),

                  // Student information card
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Card(
                      elevation: 4,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Center(
                              child: Text(
                                "Thông tin sinh viên",
                                style: TextStyle(
                                  color: Colors.blue.shade900,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 20,
                                ),
                              ),
                            ),
                            const Divider(thickness: 1.2, height: 24, color: Colors.blueGrey),
                            _buildInfoRow(Icons.person, "Họ tên", user.fullName),
                            _buildInfoRow(Icons.wc, "Giới tính", user.gender),
                            _buildInfoRow(Icons.calendar_today, "Ngày sinh", formatDate(user.dateOfBirth)),
                            _buildInfoRow(Icons.email, "Email", user.email),
                            _buildInfoRow(Icons.phone, "Số điện thoại", user.phoneNumber),
                            _buildInfoRow(Icons.class_, "Lớp", user.className),
                            _buildInfoRow(Icons.school, "Khoa", user.facultyName),
                            _buildInfoRow(Icons.computer, "Ngành học", user.majorName),
                            _buildInfoRow(Icons.access_time, "Năm vào học", user.enrollmentYear.toString()),
                          ],
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 26),

                  // Motivational banner
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                          color: Colors.blue.shade50,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.blue.shade100)),
                      padding: const EdgeInsets.all(14),
                      child: Row(
                        children: [
                          Icon(Icons.lightbulb, color: Colors.amber.shade700, size: 28),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Text(
                              "Chúc bạn một ngày học tập năng động và hiệu quả tại TLU!",
                              style: TextStyle(fontSize: 16, color: Colors.indigo.shade700),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 26),

                  // Options section with modern cards and grid layout
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Tùy chọn",
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                        ),
                        const SizedBox(height: 12),
                        GridView.count(
                          crossAxisCount: 2,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisSpacing: 18,
                          mainAxisSpacing: 18,
                          childAspectRatio: 0.88,
                          children: [
                            _buildOptionCard(
                              icon: Icons.home,
                              label: "Trang chủ",
                              color: Colors.blue,
                              onTap: () {
                                Navigator.of(context).pushAndRemoveUntil(
                                  MaterialPageRoute(builder: (_) => const ScheduleScreen()),
                                      (route) => false,
                                );
                              },
                            ),
                            _buildOptionCard(
                              icon: Icons.notifications,
                              label: "Thông báo",
                              color: Colors.amber.shade700,
                              onTap: () {
                                // Implement notifications screen navigation
                              },
                            ),
                            _buildOptionCard(
                              icon: Icons.settings,
                              label: "Cài đặt",
                              color: Colors.grey.shade700,
                              onTap: () {
                                // Implement settings screen navigation
                              },
                            ),
                            _buildOptionCard(
                              icon: Icons.logout,
                              label: "Đăng xuất",
                              color: Colors.red.shade700,
                              onTap: () => _logout(context),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 26),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
