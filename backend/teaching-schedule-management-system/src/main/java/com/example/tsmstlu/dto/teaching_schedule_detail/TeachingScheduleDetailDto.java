package com.example.tsmstlu.dto.teaching_schedule_detail;

import lombok.Data;

@Data
public class TeachingScheduleDetailDto {
    private Long id;
    private String dayOfWeek;
    private String period;
    private String duration;
    private String type;
}
