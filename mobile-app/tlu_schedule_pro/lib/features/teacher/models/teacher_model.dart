import 'package:flutter/material.dart';

class TeacherModel {
  final String name;
  final String faculty;
  final String avatarUrl; // keep empty for placeholder

  const TeacherModel({
    required this.name,
    required this.faculty,
    this.avatarUrl = '',
  });
}