class TeacherNotification {
  final int id;
  final String title;
  final String content;
  final bool isRead;

  TeacherNotification({
    required this.id,
    required this.title,
    required this.content,
    required this.isRead,
  });

  factory TeacherNotification.fromJson(Map<String, dynamic> json) {
    return TeacherNotification(
      id: json['id'],
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      isRead: json['isRead'] ?? false,
    );
  }
}
