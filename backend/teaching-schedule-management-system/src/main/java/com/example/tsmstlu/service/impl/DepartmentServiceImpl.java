package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.department.DepartmentDto;
import com.example.tsmstlu.entity.DepartmentEntity;
import com.example.tsmstlu.repository.DepartmentRepository;
import com.example.tsmstlu.service.DepartmentService;
import com.example.tsmstlu.utils.MapperUtils;
import org.springframework.stereotype.Service;

@Service
public class DepartmentServiceImpl extends BaseServiceImpl<DepartmentEntity, DepartmentDto, DepartmentDto, DepartmentDto, DepartmentDto, Long> implements DepartmentService {

    private final MapperUtils mapper;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository, MapperUtils mapper) {
        super(departmentRepository);
        this.mapper = mapper;
    }

    @Override
    protected DepartmentDto toListDto(DepartmentEntity entity) {
        return mapper.toDepartmentDto(entity);
    }

    @Override
    protected DepartmentDto toDetailDto(DepartmentEntity entity) {
        return mapper.toDepartmentDto(entity);
    }

    @Override
    protected DepartmentEntity fromCreateDto(DepartmentDto departmentDto) {
        return mapper.toDepartmentEntity(departmentDto);
    }

    @Override
    protected DepartmentEntity fromUpdateDto(DepartmentDto departmentDto) {
        return mapper.toDepartmentEntity(departmentDto);
    }

    @Override
    protected void setId(DepartmentEntity entity, Long id) {
        entity.setId(id);
    }

    @Override
    protected String getEntityName() {
        return "departments";
    }
}
