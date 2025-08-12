package com.example.tsmstlu.dto.schedule_change;

import com.example.tsmstlu.dto.teaching_schedule.TeachingScheduleResponseDto;
import lombok.Data;

import java.util.Date;

@Data
public class ScheduleChangeDto {
    private Long id;
    private String type;
    private TeachingScheduleResponseDto teachingSchedule;
    private Date createdAt;
}