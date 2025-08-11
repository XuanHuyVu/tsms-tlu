package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.teaching_schedule.*;
import com.example.tsmstlu.entity.*;
import com.example.tsmstlu.repository.*;
import com.example.tsmstlu.utils.MapperUtils;
import com.example.tsmstlu.service.TeachingScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeachingScheduleServiceImpl implements TeachingScheduleService {

    private final TeachingScheduleRepository teachingScheduleRepository;
    private final MapperUtils mapperUtils;
    private final ClassSectionRepository classSectionRepository;

    @Override
    public List<TeachingScheduleListDto> getAll() {
        return teachingScheduleRepository.findAll()
                .stream()
                .map(mapperUtils::toTeachingScheduleListDto)
                .collect(Collectors.toList());
    }

    @Override
    public TeachingScheduleDto getById(Long id) {
        TeachingScheduleEntity entity = teachingScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        return mapperUtils.toTeachingScheduleDto(entity);
    }

    @Override
    @Transactional
    public TeachingScheduleDto create(TeachingScheduleCreateDto dto) {
        TeachingScheduleEntity schedule = mapperUtils.toTeachingScheduleEntity(dto);

        if(dto.getClassSectionId() != null) {
            ClassSectionEntity classSection = classSectionRepository.findById(dto.getClassSectionId())
                    .orElseThrow(() -> new RuntimeException("Class section not found"));
            schedule.setClassSection(classSection);

            schedule.setRoom(classSection.getRoom());
            schedule.setSemester(classSection.getSemester());
            schedule.setTeacher(classSection.getTeacher());
        }

        schedule.setDetails(dto.getDetails().stream()
                .map(d -> {
                    TeachingScheduleDetailEntity detail = mapperUtils.toTeachingScheduleDetailEntity(d);
                    detail.setSchedule(schedule);
                    return detail;
                }).collect(Collectors.toList())
        );

        TeachingScheduleEntity saved = teachingScheduleRepository.save(schedule);
        return mapperUtils.toTeachingScheduleDto(saved);
    }

    @Override
    @Transactional
    public TeachingScheduleDto update(Long id, TeachingScheduleUpdateDto dto) {
        TeachingScheduleEntity schedule = teachingScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        mapperUtils.copyEntity(dto, schedule);

        if(dto.getClassSectionId() != null) {
            ClassSectionEntity classSection = classSectionRepository.findById(dto.getClassSectionId())
                    .orElseThrow(() -> new RuntimeException("Class section not found"));
            schedule.setClassSection(classSection);

            schedule.setRoom(classSection.getRoom());
            schedule.setSemester(classSection.getSemester());
            schedule.setTeacher(classSection.getTeacher());
        }

        schedule.getDetails().clear();
        dto.getDetails().forEach(d -> {
            TeachingScheduleDetailEntity detail = mapperUtils.toTeachingScheduleDetailEntity(d);
            detail.setSchedule(schedule);
            schedule.getDetails().add(detail);
        });

        TeachingScheduleEntity updated = teachingScheduleRepository.save(schedule);
        return mapperUtils.toTeachingScheduleDto(updated);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!teachingScheduleRepository.existsById(id)) {
            throw new RuntimeException("Schedule not found");
        }
        teachingScheduleRepository.deleteById(id);
        log.info("Deleted teaching schedule with id: {}", id);
    }
}
