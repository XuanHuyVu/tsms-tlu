package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.class_section.ClassSectionCreateDto;
import com.example.tsmstlu.dto.class_section.ClassSectionDto;
import com.example.tsmstlu.dto.class_section.ClassSectionListDto;
import com.example.tsmstlu.dto.class_section.ClassSectionUpdateDto;
import com.example.tsmstlu.entity.ClassSectionEntity;
import com.example.tsmstlu.service.ClassSectionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/class-sections")
@PreAuthorize("hasRole('ADMIN')")
public class ClassSectionController extends BaseController<
        ClassSectionEntity,
        ClassSectionListDto,
        ClassSectionDto,
        ClassSectionCreateDto,
        ClassSectionUpdateDto,
        Long> {

    public ClassSectionController(ClassSectionService classSectionService) {
        super(classSectionService);
    }
}
