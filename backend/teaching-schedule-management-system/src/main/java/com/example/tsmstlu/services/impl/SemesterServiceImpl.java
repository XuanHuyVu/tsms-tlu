package com.example.tsmstlu.services.impl;

import com.example.tsmstlu.dtos.semester.SemesterDto;
import com.example.tsmstlu.models.SemesterEntity;
import com.example.tsmstlu.repositories.SemesterRepository;
import com.example.tsmstlu.services.SemesterService;
import com.example.tsmstlu.utils.MapperUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SemesterServiceImpl extends BaseServiceImpl<SemesterEntity, SemesterDto, Long> implements SemesterService {

    private final MapperUtils mapper;

    public SemesterServiceImpl(SemesterRepository repository, MapperUtils mapper) {
        super(repository);
        this.mapper = mapper;
    }

    @Override
    protected SemesterDto toDto(SemesterEntity entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected SemesterEntity toEntity(SemesterDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void setId(SemesterEntity entity, Long id) {
        entity.setId(id);
    }
}

