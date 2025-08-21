package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.teaching_log.TeacherStatsDto;
import com.example.tsmstlu.entity.TeacherEntity;
import com.example.tsmstlu.repository.TeacherRepository;
import com.example.tsmstlu.repository.TeachingScheduleDetailRepository;
import com.example.tsmstlu.service.TeachingLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeachingLogServiceImpl implements TeachingLogService {

    private final TeachingScheduleDetailRepository teachingScheduleDetailRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public List<TeacherStatsDto> getAllTeacherStats(Long semesterId) {
        return teachingScheduleDetailRepository.getAllTeacherStats(semesterId);
    }

    @Override
    public List<TeacherStatsDto> getTeacherStats(Long teacherId, Long semesterId) {
        return teachingScheduleDetailRepository.getTeacherStats(teacherId, semesterId);
    }

    public List<TeacherStatsDto> getTeacherStatsByUsername(String username, Long semesterId) {
        TeacherEntity teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Teacher not found with username: " + username));

        return teachingScheduleDetailRepository.getTeacherStats(teacher.getId(), semesterId);
    }
}
