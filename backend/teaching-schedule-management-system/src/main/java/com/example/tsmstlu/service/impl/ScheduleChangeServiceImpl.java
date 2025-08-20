package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.schedule_change.*;
import com.example.tsmstlu.entity.RoomEntity;
import com.example.tsmstlu.entity.ScheduleChangeEntity;
import com.example.tsmstlu.repository.RoomRepository;
import com.example.tsmstlu.repository.ScheduleChangeRepository;
import com.example.tsmstlu.repository.TeachingScheduleRepository;
import com.example.tsmstlu.service.ScheduleChangeService;
import com.example.tsmstlu.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleChangeServiceImpl implements ScheduleChangeService {

    private final ScheduleChangeRepository scheduleChangeRepository;
    private final MapperUtils mapper;
    private final TeachingScheduleRepository teachingScheduleRepository;
    private final RoomRepository roomRepository;

    @Override
    public List<ScheduleChangeDto> getAll() {
        return scheduleChangeRepository.findAll()
                .stream()
                .map(mapper::toScheduleChangeListDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClassCancelDto getClassCancelById(Long id) {
        ScheduleChangeEntity entity = scheduleChangeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule change not found with id: " + id));
        return mapper.toClassCancelDto(entity);
    }

    @Override
    public ClassCancelDto createClassCancel(ClassCancelCreateDto dto) {
        var teachingSchedule = teachingScheduleRepository.findById(dto.getTeachingScheduleId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Teaching schedule not found with id: " + dto.getTeachingScheduleId()
                ));

        ScheduleChangeEntity entity = new ScheduleChangeEntity();
        entity.setTeachingSchedule(teachingSchedule);
        entity.setReason(dto.getReason());
        entity.setFileUrl(dto.getFileUrl());
        entity.setType("CLASS_CANCEL");
        entity.setStatus("CHUA_DUYET");

        ScheduleChangeEntity saved = scheduleChangeRepository.save(entity);
        return mapper.toClassCancelDto(saved);
    }

    @Override
    public MakeUpClassDto getMakeUpClassById(Long id) {
         ScheduleChangeEntity entity = scheduleChangeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Make-up class not found with id: " + id));
        return mapper.toMakeUpClassDto(entity);
    }

    @Override
    public MakeUpClassDto createMakeUpClass(MakeUpClassCreateDto dto) {
        var teachingSchedule = teachingScheduleRepository.findById(dto.getTeachingScheduleId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Teaching schedule not found with id: " + dto.getTeachingScheduleId()
                ));

        ScheduleChangeEntity entity = new ScheduleChangeEntity();
        entity.setTeachingSchedule(teachingSchedule);
        entity.setType("MAKE_UP_CLASS");
        entity.setNewPeriodStart(dto.getNewPeriodStart());
        entity.setNewPeriodEnd(dto.getNewPeriodEnd());
        entity.setNewDate(dto.getNewDate());
        entity.setLectureContent(dto.getLectureContent());
        entity.setFileUrl(dto.getFileUrl());
        entity.setStatus("CHUA_DUYET");


        if(dto.getNewRoomId() != null) {
            RoomEntity room = roomRepository.findById(dto.getNewRoomId())
                    .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + dto.getNewRoomId()));
            entity.setNewRoom(room);
        }

        ScheduleChangeEntity saved = scheduleChangeRepository.save(entity);
        return mapper.toMakeUpClassDto(saved);
    }
}