package com.example.tsmstlu.services.impl;

import com.example.tsmstlu.dtos.faculty.FacultyDto;
import com.example.tsmstlu.models.FacultyEntity;
import com.example.tsmstlu.repositories.FacultyRepository;
import com.example.tsmstlu.services.FacultyService;
import com.example.tsmstlu.utils.MapperUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FacultyServiceImpl extends BaseServiceImpl<FacultyEntity, FacultyDto, Long> implements FacultyService {

    private final MapperUtils mapper;

    public FacultyServiceImpl(FacultyRepository repository, MapperUtils mapper) {
        super(repository);
        this.mapper = mapper;
    }

    @Override
    protected FacultyDto toDto(FacultyEntity entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected FacultyEntity toEntity(FacultyDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void setId(FacultyEntity entity, Long id) {
        entity.setId(id);
    }
}
