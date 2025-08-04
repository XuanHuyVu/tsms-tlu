package com.example.tsmstlu.controllers.admin;

import com.example.tsmstlu.dtos.faculty.FacultyDto;
import com.example.tsmstlu.models.FacultyEntity;
import com.example.tsmstlu.services.FacultyService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/faculties")
@PreAuthorize("hasRole('ADMIN')")
public class FacultyController extends BaseController<FacultyEntity, FacultyDto,FacultyDto, FacultyDto, FacultyDto, Long> {

    public FacultyController(FacultyService facultyService) {
        super(facultyService);
    }
}
