package com.example.tsmstlu.controllers.admin;

import com.example.tsmstlu.dtos.semester.SemesterDto;
import com.example.tsmstlu.models.SemesterEntity;
import com.example.tsmstlu.services.SemesterService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/semesters")
@PreAuthorize("hasRole('ADMIN')")
public class SemesterController extends BaseController<SemesterEntity, SemesterDto,SemesterDto,SemesterDto,SemesterDto, Long> {

    public SemesterController(SemesterService semesterService) {
        super(semesterService);
    }
}