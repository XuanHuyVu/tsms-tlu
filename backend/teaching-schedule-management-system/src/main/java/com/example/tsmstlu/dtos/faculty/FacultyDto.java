package com.example.tsmstlu.dtos.faculty;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacultyDto {
    private Long id;
    private String code;
    private String name;
    private String description;
}
