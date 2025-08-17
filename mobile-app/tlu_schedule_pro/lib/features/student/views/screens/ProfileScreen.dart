import 'package:flutter/material.dart';
import '../../models/ProfileEntity.dart';
import '../../services/ProfileService.dart';

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

  // Hàm format ngày tháng đặt ở đây
  String formatDate(String isoDate) {
    try {
      final DateTime parsedDate = DateTime.parse(isoDate);
      return "${parsedDate.day.toString().padLeft(2, '0')}/"
          "${parsedDate.month.toString().padLeft(2, '0')}/"
          "${parsedDate.year}";
    } catch (e) {
      return isoDate; // fallback nếu parse lỗi
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
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

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header
                Container(
                  color: Colors.blue,
                  padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                  child: Column(
                    children: [
                      const CircleAvatar(
                        radius: 45,
                        backgroundImage: AssetImage("assets/images/avatar.png"),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        "${user.fullName} (${user.studentCode})",
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      Text(
                        user.facultyName,
                        style: const TextStyle(color: Colors.white70),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 10),

                // Thông tin cá nhân
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(15),
                      border: Border.all(color: Colors.grey.shade300, width: 1),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.2),
                          spreadRadius: 2,
                          blurRadius: 6,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        _buildInfoRow(Icons.perm_identity, "Mã sinh viên", user.studentCode),
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

                // Tùy chọn
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Tùy chọn",
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.grey.shade300, width: 1),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey.withOpacity(0.2),
                              spreadRadius: 2,
                              blurRadius: 6,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            _buildOption(Icons.notifications, "Thông báo", Colors.amber),
                            _buildOption(Icons.settings, "Cài đặt", Colors.grey),
                            _buildOption(Icons.logout, "Đăng xuất", Colors.red),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return ListTile(
      leading: Icon(icon),
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
      trailing: Text(value, style: const TextStyle(fontSize: 14)),
    );
  }

  Widget _buildOption(IconData icon, String title, Color color) {
    return Column(
      children: [
        Icon(icon, size: 36, color: color),
        const SizedBox(height: 4),
        Text(title, style: const TextStyle(fontSize: 14)),
      ],
    );
  }
}
