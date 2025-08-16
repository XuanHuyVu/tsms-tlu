import 'package:flutter/material.dart';
import '../../models/teacher_model.dart';

class TeacherInfoCard extends StatelessWidget {
  final TeacherModel teacher;
  const TeacherInfoCard({super.key, required this.teacher});

  @override
  Widget build(BuildContext context) {
    final percent = (teacher.progressPercent * 100).toStringAsFixed(0);

    return Card(
      margin: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 1.5,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundImage: teacher.avatarUrl.isNotEmpty
                      ? NetworkImage(teacher.avatarUrl)
                      : null,
                  child: teacher.avatarUrl.isEmpty
                      ? const Icon(Icons.person, size: 28)
                      : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(teacher.name,
                          style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 4),
                      Text(teacher.faculty,
                          style: Theme.of(context)
                              .textTheme
                              .bodySmall
                              ?.copyWith(color: Colors.grey[700])),
                    ],
                  ),
                ),
                Icon(Icons.verified, color: Colors.blue[600]),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _StatTile(title: 'Tiết hôm nay', value: '${teacher.sessionsToday}'),
                const SizedBox(width: 8),
                _StatTile(title: 'Tiết tuần này', value: '${teacher.sessionsThisWeek}'),
                const SizedBox(width: 8),
                _StatTile(title: 'Hoàn thành', value: '$percent%'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  final String title;
  final String value;
  const _StatTile({required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        height: 64,
        decoration: BoxDecoration(
          color: Colors.blue[50],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(value, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 2),
              Text(title,
                  style: Theme.of(context)
                      .textTheme
                      .labelSmall
                      ?.copyWith(color: Colors.blueGrey)),
            ],
          ),
        ),
      ),
    );
  }
}
