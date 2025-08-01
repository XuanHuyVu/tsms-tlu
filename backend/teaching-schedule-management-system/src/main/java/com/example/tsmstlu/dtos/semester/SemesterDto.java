package com.example.tsmstlu.dtos.semester;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SemesterDto {
    private Long id;
    private String name;
    private String academicYear;
    private String term;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}
