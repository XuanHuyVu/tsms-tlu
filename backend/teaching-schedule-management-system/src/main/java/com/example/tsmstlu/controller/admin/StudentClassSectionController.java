package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.student_class_section.StudentClassSectionCreateDto;
import com.example.tsmstlu.entity.StudentClassSectionEntity;
import com.example.tsmstlu.service.StudentClassSectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/student-class-sections")
@PreAuthorize("hasRole('ADMIN')")
public class StudentClassSectionController {

    private final StudentClassSectionService studentClassSectionService;

    public StudentClassSectionController(StudentClassSectionService service) {
        this.studentClassSectionService = service;
    }

    @PostMapping
    public ResponseEntity<StudentClassSectionCreateDto> create(@RequestBody StudentClassSectionCreateDto dto) {
        return ResponseEntity.ok(studentClassSectionService.create(dto));
    }

}
