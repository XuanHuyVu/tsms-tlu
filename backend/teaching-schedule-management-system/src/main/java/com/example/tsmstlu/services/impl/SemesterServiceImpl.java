package com.example.tsmstlu.services.impl;

import com.example.tsmstlu.dtos.semester.SemesterDto;
import com.example.tsmstlu.models.SemesterEntity;
import com.example.tsmstlu.repositories.SemesterRepository;
import com.example.tsmstlu.services.SemesterService;
import com.example.tsmstlu.utils.MapperUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository repository;
    private final MapperUtils mapper;

    @Override
    public List<SemesterDto> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SemesterDto getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseGet(() -> {
                    log.warn("Semester with id {} not found.", id);
                    return null;
                });
    }

    @Override
    public SemesterDto create(SemesterDto dto) {
        SemesterEntity entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public SemesterDto update(Long id, SemesterDto dto) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setName(dto.getName());
                    existing.setAcademicYear(dto.getAcademicYear());
                    existing.setStartDate(dto.getStartDate());
                    existing.setEndDate(dto.getEndDate());
                    existing.setTerm(SemesterEntity.Term.valueOf(dto.getTerm()));
                    existing.setStatus(SemesterEntity.SemesterStatus.valueOf(dto.getStatus()));
                    return mapper.toDto(repository.save(existing));
                })
                .orElseGet(() -> {
                    log.warn("Update failed: semester with id {} not found.", id);
                    return null;
                });
    }

    @Override
    public void delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            log.warn("Delete failed: semester with id {} not found.", id);
        }
    }
}
