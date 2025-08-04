package com.example.tsmstlu.controllers.admin;

import com.example.tsmstlu.dtos.faculty.FacultyDto;
import com.example.tsmstlu.models.FacultyEntity;
import com.example.tsmstlu.services.FacultyService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/faculties")
public class FacultyController extends BaseController<FacultyEntity, FacultyDto, Long> {

    public FacultyController(FacultyService facultyService) {
        super(facultyService);
    }
}
