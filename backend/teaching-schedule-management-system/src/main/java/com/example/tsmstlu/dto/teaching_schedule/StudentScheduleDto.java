package com.example.tsmstlu.dto.teaching_schedule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentScheduleDto {
    private Long classSectionId;
    private String classSectionName;
    private String subjectName;
    private String teacherName;
    private String roomCode;
    private LocalDate studyDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String type;
}
