import 'dart:async';
import '../models/ProfileEntity.dart';

class ProfileService {
  Future<ProfileEntity> fetchProfile() async {
    // Giả lập thời gian gọi API
    await Future.delayed(const Duration(seconds: 1));

    // Trả về dữ liệu giả
    return ProfileEntity(
      fullName: "Đỗ Thị Hiền Lương",
      studentId: "2251172468",
      email: "2251172468@e.tlu.edu.vn",
      dateOfBirth: "27/09/2004",
      className: "64KTPM3",
      faculty: "Công nghệ thông tin",
      major: "Kỹ thuật phần mềm",
      admissionYear: 2022,
    );
  }
}
