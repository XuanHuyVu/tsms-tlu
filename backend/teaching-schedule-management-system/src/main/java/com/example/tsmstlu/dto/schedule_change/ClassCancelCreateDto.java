package com.example.tsmstlu.dto.schedule_change;

import lombok.Data;

@Data
public class ClassCancelCreateDto {
    private Long teachingScheduleId;
    private String reason;
    private String fileUrl;
}
