import 'dart:convert';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'dart:io' show File;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:file_picker/file_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:html' as html;

class AvatarService {
  static const _prefsKey = "profile_avatar_base64";

  /// Resize ảnh nếu quá lớn
  static Future<Uint8List?> resizeImage(Uint8List imageBytes) async {
    try {
      final ui.Codec codec = await ui.instantiateImageCodec(
        imageBytes,
        targetWidth: 300,
        targetHeight: 300,
      );
      final ui.FrameInfo frameInfo = await codec.getNextFrame();

      final byteData =
      await frameInfo.image.toByteData(format: ui.ImageByteFormat.png);

      return byteData?.buffer.asUint8List();
    } catch (_) {
      return null;
    }
  }

  /// Lưu avatar vào SharedPreferences + localStorage (web)
  static Future<void> saveAvatar(String base64Image) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefsKey, base64Image);

    if (kIsWeb) {
      final domain = html.window.location.hostname;
      final avatarKey = "tlu_avatar_${domain}_base64";
      html.window.localStorage[avatarKey] = base64Image;
      html.window.sessionStorage['tlu_avatar_session'] = base64Image;
    }
  }

  /// Lấy avatar từ storage
  static Future<String?> loadAvatar() async {
    final prefs = await SharedPreferences.getInstance();
    String? avatar = prefs.getString(_prefsKey);

    if (kIsWeb && (avatar == null || avatar.isEmpty)) {
      final domain = html.window.location.hostname;
      final avatarKey = "tlu_avatar_${domain}_base64";
      avatar = html.window.localStorage[avatarKey] ??
          html.window.sessionStorage['tlu_avatar_session'];
    }

    return avatar;
  }

  /// Xoá avatar khỏi tất cả storage
  static Future<void> removeAvatar() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_prefsKey);

    if (kIsWeb) {
      final domain = html.window.location.hostname;
      html.window.localStorage.remove("tlu_avatar_${domain}_base64");
      html.window.sessionStorage.remove('tlu_avatar_session');
    }
  }

  /// Chọn avatar mới bằng FilePicker
  static Future<String?> pickAvatar() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.image,
      allowMultiple: false,
    );

    if (result == null || result.files.isEmpty) return null;

    Uint8List? bytes;
    final file = result.files.first;

    if (kIsWeb) {
      bytes = file.bytes;
    } else if (file.path != null) {
      final f = File(file.path!);
      bytes = await f.readAsBytes();
    }

    if (bytes == null) return null;

    // resize nếu quá lớn
    if (bytes.length > 500000) {
      final resized = await resizeImage(bytes);
      bytes = resized ?? bytes;
    }

    final base64Image = base64Encode(bytes);
    await saveAvatar(base64Image);

    return base64Image;
  }
}
