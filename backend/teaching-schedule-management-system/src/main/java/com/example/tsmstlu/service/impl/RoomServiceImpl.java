package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.room.RoomCreateDto;
import com.example.tsmstlu.dto.room.RoomDto;
import com.example.tsmstlu.dto.room.RoomListDto;
import com.example.tsmstlu.dto.room.RoomUpdateDto;
import com.example.tsmstlu.entity.RoomEntity;
import com.example.tsmstlu.repository.RoomRepository;
import com.example.tsmstlu.service.RoomService;
import com.example.tsmstlu.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final MapperUtils mapper;

    @Override
    public List<RoomListDto> getAll() {
        return roomRepository.findAll()
                .stream()
                .map(mapper::toRoomListDto)
                .toList();
    }

    @Override
    public RoomDto getById(Long id) {
        RoomEntity entity = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + id));
        return mapper.toRoomDetailDto(entity);
    }

    @Override
    public RoomDto create(RoomCreateDto roomCreateDto) {
        RoomEntity entity = mapper.toRoomEntity(roomCreateDto);
        RoomEntity saved = roomRepository.save(entity);
        return mapper.toRoomDetailDto(saved);
    }

    @Override
    public RoomDto update(Long id, RoomUpdateDto roomUpdateDto) {
        RoomEntity entity = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + id));

        mapper.copyEntity(roomUpdateDto, entity);
        RoomEntity updated = roomRepository.save(entity);
        return mapper.toRoomDetailDto(updated);
    }

    @Override
    public void delete(Long id) {
        if(!roomRepository.existsById(id)) {
            throw new EntityNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
        log.info("Room with id {} deleted successfully", id);
    }
}
