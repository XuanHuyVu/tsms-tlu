package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.major.MajorCreateDto;
import com.example.tsmstlu.dto.major.MajorDto;
import com.example.tsmstlu.dto.major.MajorListDto;
import com.example.tsmstlu.dto.major.MajorUpdateDto;
import com.example.tsmstlu.entity.FacultyEntity;
import com.example.tsmstlu.entity.MajorEntity;
import com.example.tsmstlu.repository.FacultyRepository;
import com.example.tsmstlu.repository.MajorRepository;
import com.example.tsmstlu.service.MajorService;
import com.example.tsmstlu.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MajorServiceImpl implements MajorService {

    private final MapperUtils mapper;
    private final MajorRepository majorRepository;
    private final FacultyRepository facultyRepository;

    @Override
    public List<MajorListDto> getAll() {
        return majorRepository.findAll()
                .stream()
                .map(mapper::toMajorListDto)
                .collect(Collectors.toList());
    }

    @Override
    public MajorDto getById(Long id) {
        MajorEntity entity = majorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Major not found with id: " + id));
        return mapper.toMajorDto(entity);
    }

    @Override
    public MajorDto create(MajorCreateDto dto) {
        MajorEntity entity = mapper.toMajorEntity(dto);

        if(dto.getFacultyId() != null) {
            FacultyEntity faculty = facultyRepository.findById(dto.getFacultyId())
                    .orElseThrow(() -> new EntityNotFoundException("Faculty not found with id: " + dto.getFacultyId()));
            entity.setFaculty(faculty);
        }

        MajorEntity saved = majorRepository.save(entity);
        return mapper.toMajorDto(saved);
    }

    @Override
    public MajorDto update(Long id, MajorUpdateDto dto) {
        MajorEntity entity = majorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Major not found with id: " + id));

        mapper.copyEntity(dto, entity);

        if(dto.getFacultyId() != null) {
            FacultyEntity faculty = facultyRepository.findById(dto.getFacultyId())
                    .orElseThrow(() -> new EntityNotFoundException("Faculty not found with id: " + dto.getFacultyId()));
            entity.setFaculty(faculty);
        }

        MajorEntity updated = majorRepository.save(entity);
        return mapper.toMajorDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!majorRepository.existsById(id)) {
            throw new EntityNotFoundException("Major not found with id: " + id);
        }
        majorRepository.deleteById(id);
        log.info("Deleted major with id: {}", id);

    }
}
