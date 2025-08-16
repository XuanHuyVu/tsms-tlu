package com.example.tsmstlu.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileDto {
    private Long id;
    private String studentCode;
    private String fullName;
    private String gender;
    private String email;
    private String phoneNumber;
    private Date dateOfBirth;
    private String className;
    private Integer enrollmentYear;
    private String majorName;
    private String facultyName;
}
