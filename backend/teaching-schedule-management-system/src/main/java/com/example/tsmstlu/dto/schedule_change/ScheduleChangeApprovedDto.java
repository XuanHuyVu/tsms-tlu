package com.example.tsmstlu.dto.schedule_change;

import com.example.tsmstlu.dto.teaching_schedule.TeachingScheduleResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleChangeApprovedDto {
    private String type;
    private TeachingScheduleResponseDto teachingSchedule;
    private Date createdAt;
    private String status;
}