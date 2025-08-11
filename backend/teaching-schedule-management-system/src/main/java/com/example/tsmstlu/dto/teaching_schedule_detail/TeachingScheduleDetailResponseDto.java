package com.example.tsmstlu.dto.teaching_schedule_detail;

import lombok.Data;

@Data
public class TeachingScheduleDetailResponseDto {
    private String dayOfWeek;
    private String teachingDate;
    private String periodStart;
    private String periodEnd;
    private String type;
}
