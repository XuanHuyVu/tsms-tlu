package com.example.tsmstlu.dto.teaching_schedule;

import com.example.tsmstlu.dto.class_section.ClassSectionResponseDto;
import com.example.tsmstlu.dto.room.RoomResponseDto;
import com.example.tsmstlu.dto.semester.SemesterResponseDto;
import com.example.tsmstlu.dto.teacher.TeacherResponseDto;
import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailResponseDto;
import lombok.Data;

import java.util.List;

@Data
public class TeachingScheduleResponseDto {
    private Long id;
    private TeacherResponseDto teacher;
    private ClassSectionResponseDto classSection;
    private SemesterResponseDto semester;
    private RoomResponseDto room;
    private String note;
    private List<TeachingScheduleDetailResponseDto> details;
}
