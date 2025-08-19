import 'package:flutter/material.dart';

Future<bool> showLogoutConfirmationDialog(BuildContext context) async {
  final result = await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      title: Column(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: Colors.blue,
            child: Icon(
              Icons.help_outline,
              size: 32,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Xác nhận đăng xuất',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
        ],
      ),
      content: const Text(
        'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?',
        style: TextStyle(fontSize: 14),
      ),
      contentPadding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
      actionsPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      actionsAlignment: MainAxisAlignment.spaceBetween,
      actions: [
        SizedBox(
          width: 140,
          height: 40,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(6),
              ),
            ),
            child: const Text('Đăng xuất', style: TextStyle(fontSize: 16, color: Colors.white)),
            onPressed: () => Navigator.of(context).pop(true),
          ),
        ),
        SizedBox(
          width: 140,
          height: 40,
          child: OutlinedButton(
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: Colors.black),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(6),
              ),
              backgroundColor: Colors.white,
            ),
            child: const Text('Hủy bỏ', style: TextStyle(fontSize: 16, color: Colors.black)),
            onPressed: () => Navigator.of(context).pop(false),
          ),
        ),
      ],
    ),
  );
  return result ?? false;
}
