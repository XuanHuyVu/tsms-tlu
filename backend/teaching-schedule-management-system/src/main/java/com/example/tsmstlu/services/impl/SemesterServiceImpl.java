package com.example.tsmstlu.services.impl;

import com.example.tsmstlu.dtos.semester.SemesterDto;
import com.example.tsmstlu.models.SemesterEntity;
import com.example.tsmstlu.repositories.SemesterRepository;
import com.example.tsmstlu.services.SemesterService;
import com.example.tsmstlu.utils.MapperUtils;
import org.springframework.stereotype.Service;

@Service
public class SemesterServiceImpl extends BaseServiceImpl<SemesterEntity,SemesterDto,SemesterDto,SemesterDto,SemesterDto,Long> implements SemesterService {

    private final MapperUtils mapper;

    public SemesterServiceImpl(SemesterRepository repository, MapperUtils mapper) {
        super(repository);
        this.mapper = mapper;
    }

    @Override
    protected SemesterDto toListDto(SemesterEntity entity) {
        return mapper.toSemesterDto(entity);
    }

    @Override
    protected SemesterDto toDetailDto(SemesterEntity entity) {
        return mapper.toSemesterDto(entity);
    }

    @Override
    protected SemesterEntity fromCreateDto(SemesterDto dto) {
        return mapper.toSemesterEntity(dto);
    }

    @Override
    protected SemesterEntity fromUpdateDto(SemesterDto dto) {
        return mapper.toSemesterEntity(dto);
    }

    @Override
    protected void setId(SemesterEntity entity, Long id) {
        entity.setId(id);
    }
}


