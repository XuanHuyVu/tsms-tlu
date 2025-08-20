package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.teaching_log.TeacherStatsDto;

import java.util.List;

public interface TeachingLogService {
    // Thống kê tất cả giảng viên (admin)
    List<TeacherStatsDto> getAllTeacherStats(Long semesterId);

//    // Thống kê giảng viên cá nhân
//    List<TeacherStatsDto> getTeacherStats(Long teacherId, Long semesterId);
}
