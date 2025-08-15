package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.student_class_section.StudentClassSectionCreateDto;
import com.example.tsmstlu.dto.student_class_section.StudentInClassDto;
import java.util.List;

public interface StudentClassSectionService {
    List<StudentInClassDto> getStudentsInClassSection(Long classSectionId);
    StudentClassSectionCreateDto create(StudentClassSectionCreateDto studentClassSectionCreateDto);
    void delete(Long classSectionId, Long studentId);

}
