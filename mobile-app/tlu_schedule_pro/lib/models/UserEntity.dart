class UserEntity {
  late final String username;
  late final String token;

  UserEntity({required this.username, required this.token});

  factory UserEntity.fromJson(Map<String, dynamic> json) {
    return UserEntity(
      username: json['username'],
      token: json['token'],
    );
  }
}
