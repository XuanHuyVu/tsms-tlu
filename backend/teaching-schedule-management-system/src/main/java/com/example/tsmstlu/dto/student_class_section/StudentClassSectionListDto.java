package com.example.tsmstlu.dto.student_class_section;

import com.example.tsmstlu.dto.class_section.ClassSectionResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassSectionListDto {
    private ClassSectionResponseDto classSection;
    private Long studentCount;
}
