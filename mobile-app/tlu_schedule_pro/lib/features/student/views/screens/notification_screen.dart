import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:tlu_schedule_pro/features/student/models/notification_model.dart';
import 'package:tlu_schedule_pro/features/student/services/notification_service.dart';
import 'schedule_screen.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  late Future<List<NotificationModel>> _futureNotifications;
  final NotificationService _notificationService = NotificationService();

  @override
  void initState() {
    super.initState();
    _futureNotifications = _notificationService.fetchNotifications();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: const Color(0xFF4A90E2),
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white, size: 28),
            splashRadius: 24,
            tooltip: 'Quay lại Trang Chủ',
            onPressed: () {
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (context) => const ScheduleScreen()),
              );
            },
          ),
          centerTitle: true,
          title: Text(
            'Thông báo',
            style: GoogleFonts.montserrat(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 20,
            ),
          ),
          bottom: const TabBar(
            indicatorColor: Colors.white,
            labelColor: Colors.white,
            unselectedLabelColor: Colors.white70,
            tabs: [
              Tab(text: 'Tất cả'),
              Tab(text: 'Đã đọc'),
              Tab(text: 'Chưa đọc'),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.search, color: Colors.white),
              tooltip: 'Tìm kiếm',
              onPressed: () {
              },
            ),
          ],
        ),


        body: FutureBuilder<List<NotificationModel>>(
          future: _futureNotifications,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Lỗi: ${snapshot.error}'));
            }

            final all = snapshot.data ?? [];
            final read = all.where((n) => n.isRead).toList();
            final unread = all.where((n) => !n.isRead).toList();

            return TabBarView(
              children: [
                NotificationList(notifications: all),
                NotificationList(notifications: read),
                NotificationList(notifications: unread),
              ],
            );
          },
        ),
      ),
    );
  }
}

class NotificationList extends StatelessWidget {
  final List<NotificationModel> notifications;

  const NotificationList({super.key, required this.notifications});

  @override
  Widget build(BuildContext context) {
    if (notifications.isEmpty) {
      return const Center(child: Text('Không có thông báo.'));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: notifications.length,
      itemBuilder: (context, index) {
        final n = notifications[index];
        return Card(
          color: n.isRead ? Colors.white : Colors.blue[50],
          margin: const EdgeInsets.only(bottom: 10),
          child: ListTile(
            leading: n.isRead
                ? const Icon(Icons.notifications)
                : Stack(
              children: [
                const Icon(Icons.notifications),
                Positioned(
                  right: 0,
                  top: 0,
                  child: CircleAvatar(radius: 5, backgroundColor: Colors.red),
                ),
              ],
            ),
            title: Text(n.title, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(n.content),
                const SizedBox(height: 4),
                Text(
                  _formatDateTime(n.createdAt),
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
            isThreeLine: true,
            trailing: PopupMenuButton<String>(
              icon: const Icon(Icons.more_horiz),
              onSelected: (value) {
                switch (value) {
                  case 'delete':
                    _showDeleteConfirmation(context, n);
                    break;
                  case 'mark_read':
                    _markAsRead(context, n);
                    break;
                  case 'mark_unread':
                    _markAsUnread(context, n);
                    break;
                }
              },
              itemBuilder: (context) => [
                const PopupMenuItem<String>(
                  value: 'delete',
                  child: Text('Xóa'),
                ),
                if (!n.isRead)
                  const PopupMenuItem<String>(
                    value: 'mark_read',
                    child: Text('Đánh dấu đã đọc'),
                  ),
                if (n.isRead)
                  const PopupMenuItem<String>(
                    value: 'mark_unread',
                    child: Text('Đánh dấu chưa đọc'),
                  ),
              ],
            ),
            onTap: () {
            },
          ),
        );
      },
    );
  }

  String _formatDateTime(DateTime dateTime) {
    return "${dateTime.day.toString().padLeft(2, '0')}/"
        "${dateTime.month.toString().padLeft(2, '0')}/"
        "${dateTime.year} ${dateTime.hour.toString().padLeft(2, '0')}:"
        "${dateTime.minute.toString().padLeft(2, '0')}";
  }

  void _showDeleteConfirmation(BuildContext context, NotificationModel notification) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xác nhận'),
        content: const Text('Bạn có chắc muốn xóa thông báo này?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () {
              // Gọi API xóa hoặc cập nhật trạng thái trong Provider
              // Sau đó đóng dialog
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Đã xóa thông báo')),
              );
            },
            child: const Text('Xóa'),
          ),
        ],
      ),
    );
  }

  void _markAsRead(BuildContext context, NotificationModel notification) {
    // Cập nhật trạng thái đã đọc ở đây (có thể gọi Provider hoặc API)
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Đã đánh dấu là đã đọc')),
    );
  }

  void _markAsUnread(BuildContext context, NotificationModel notification) {
    // Cập nhật trạng thái chưa đọc
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Đã đánh dấu là chưa đọc')),
    );
  }

}
