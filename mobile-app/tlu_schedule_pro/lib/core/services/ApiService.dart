// lib/core/services/ApiService.dart
import 'package:dio/dio.dart' as dio;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/constants.dart';

class ApiService {
  ApiService._internal() {
    _dio = dio.Dio(
      dio.BaseOptions(
        baseUrl: AppConst.baseUrl, // vd: http://10.0.2.2:8080/api/
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 25),
        sendTimeout: const Duration(seconds: 15),
      ),
    );

    // Gắn token cho mọi request (nếu có)
    _dio.interceptors.add(
      dio.InterceptorsWrapper(
        onRequest: (options, handler) async {
          final sp = await SharedPreferences.getInstance();
          final token = sp.getString('auth_token');
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          // Mặc định gửi JSON
          options.headers['Content-Type'] = 'application/json';
          return handler.next(options);
        },
      ),
    );

    // Log request/response để debug URL & payload
    _dio.interceptors.add(
      dio.LogInterceptor(
        request: true,
        requestBody: true,
        responseBody: true,
        error: true,
        requestHeader: false,
        responseHeader: false,
      ),
    );
  }

  // Singleton
  static final ApiService I = ApiService._internal();

  late final dio.Dio _dio;

  /// Chuẩn hoá path: nếu lỡ truyền "/" đầu thì cắt đi
  String _norm(String path) => path.startsWith('/') ? path.substring(1) : path;

  Future<dio.Response<T>> get<T>(
      String path, {
        Map<String, dynamic>? queryParameters,
      }) {
    return _dio.get<T>(_norm(path), queryParameters: queryParameters);
  }

  Future<dio.Response<T>> post<T>(
      String path, {
        dynamic data,
        Map<String, dynamic>? queryParameters,
      }) {
    return _dio.post<T>(_norm(path), data: data, queryParameters: queryParameters);
  }

  Future<dio.Response<T>> put<T>(
      String path, {
        dynamic data,
        Map<String, dynamic>? queryParameters,
      }) {
    return _dio.put<T>(_norm(path), data: data, queryParameters: queryParameters);
  }

  Future<dio.Response<T>> delete<T>(
      String path, {
        Map<String, dynamic>? queryParameters,
        dynamic data,
      }) {
    return _dio.delete<T>(_norm(path), queryParameters: queryParameters, data: data);
  }
}
