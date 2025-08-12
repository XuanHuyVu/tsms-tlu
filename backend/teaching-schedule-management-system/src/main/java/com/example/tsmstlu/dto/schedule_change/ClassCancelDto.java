package com.example.tsmstlu.dto.schedule_change;

import com.example.tsmstlu.dto.class_section.ClassSectionResponseDto;
import com.example.tsmstlu.dto.teaching_schedule.TeachingScheduleResponseDto;
import lombok.Data;

@Data
public class ClassCancelDto {
    private Long id;
    private TeachingScheduleResponseDto teachingSchedule;
    private String reason;
    private String fileUrl;
}
