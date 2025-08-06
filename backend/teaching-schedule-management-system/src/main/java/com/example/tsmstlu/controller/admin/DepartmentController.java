package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.department.DepartmentDto;
import com.example.tsmstlu.entity.DepartmentEntity;
import com.example.tsmstlu.service.DepartmentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/departments")
@PreAuthorize("hasRole('ADMIN')")
public class DepartmentController extends BaseController<DepartmentEntity, DepartmentDto, DepartmentDto, DepartmentDto, DepartmentDto, Long> {

    public DepartmentController(DepartmentService departmentService) {
        super(departmentService);
    }
}
