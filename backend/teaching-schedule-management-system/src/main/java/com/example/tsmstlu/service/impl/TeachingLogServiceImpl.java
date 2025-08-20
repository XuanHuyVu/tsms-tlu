package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.teaching_log.TeacherStatsDto;
import com.example.tsmstlu.repository.TeachingScheduleDetailRepository;
import com.example.tsmstlu.service.TeachingLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeachingLogServiceImpl implements TeachingLogService {

    private final TeachingScheduleDetailRepository teachingScheduleDetailRepository;

    @Override
    public List<TeacherStatsDto> getAllTeacherStats(Long semesterId) {
        return teachingScheduleDetailRepository.getAllTeacherStats(semesterId);
    }

//    @Override
//    public List<TeacherStatsDto> getTeacherStats(Long teacherId, Long semesterId) {
//        return teachingScheduleDetailRepository.getTeacherStats(teacherId, semesterId);
//    }
}
