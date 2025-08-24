import 'dart:convert';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'dart:html' as html;
import 'dart:async';

class AvatarService {
  static const _prefsKey = "profile_avatar_base64";

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

  static Future<void> saveAvatar(String base64Image) async {
    final domain = html.window.location.hostname;
    final avatarKey = "tlu_avatar_${domain}_base64";
    html.window.localStorage[avatarKey] = base64Image;
    html.window.sessionStorage['tlu_avatar_session'] = base64Image;
  }

  static Future<String?> loadAvatar() async {
    final domain = html.window.location.hostname;
    final avatarKey = "tlu_avatar_${domain}_base64";
    return html.window.localStorage[avatarKey] ??
        html.window.sessionStorage['tlu_avatar_session'];
  }

  static Future<void> removeAvatar() async {
    final domain = html.window.location.hostname;
    html.window.localStorage.remove("tlu_avatar_${domain}_base64");
    html.window.sessionStorage.remove('tlu_avatar_session');
  }
}
