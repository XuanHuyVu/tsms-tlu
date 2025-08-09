package com.example.tsmstlu.dto.teaching_schedule;

import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailCreateDto;
import lombok.Data;

import java.util.List;


@Data
public class TeachingScheduleCreateDto {
    private Long teacherId;
    private Long classSectionId;
    private Long semesterId;
    private Long roomId;
    private String note;
    private List<TeachingScheduleDetailCreateDto> details;
}
