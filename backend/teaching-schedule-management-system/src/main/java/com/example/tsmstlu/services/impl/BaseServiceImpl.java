package com.example.tsmstlu.services.impl;

import com.example.tsmstlu.services.BaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public abstract class BaseServiceImpl<T, ListDto, DetailDto, CreateDto, UpdateDto, ID> implements BaseService<T, ListDto, DetailDto, CreateDto, UpdateDto, ID> {

    protected final JpaRepository<T, ID> repository;

    protected abstract ListDto toListDto(T entity);
    protected abstract DetailDto toDetailDto(T entity);
    protected abstract T fromCreateDto(CreateDto dto);
    protected abstract T fromUpdateDto(UpdateDto dto);
    protected abstract void setId(T entity, ID id);

    @Override
    public List<ListDto> getAll() {
        return repository.findAll().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Override
    public DetailDto getById(ID id) {
        Optional<T> optional = repository.findById(id);
        if (optional.isEmpty()) {
            log.warn("Entity with id {} not found.", id);
            return null;
        }
        return toDetailDto(optional.get());
    }

    @Override
    public DetailDto create(CreateDto dto) {
        T entity = fromCreateDto(dto);
        return toDetailDto(repository.save(entity));
    }

    @Override
    public DetailDto update(ID id, UpdateDto dto) {
        if (!repository.existsById(id)) {
            log.warn("Update failed: entity with id {} not found.", id);
            return null;
        }
        T entity = fromUpdateDto(dto);
        setId(entity, id);
        return toDetailDto(repository.save(entity));
    }


    @Override
    public void delete(ID id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            log.warn("Delete failed: entity with id {} not found.", id);
        }
    }
}
