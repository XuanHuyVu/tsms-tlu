class UserEntity {
  final String username;
  final String token;
  final String role;

  UserEntity({
    required this.username,
    required this.token,
    required this.role,
  });

  factory UserEntity.fromJson(Map<String, dynamic> json) {
    return UserEntity(
      token: json['token'],
      username: json['user']['username'],
      role: json['user']['role'],
    );
  }
}
