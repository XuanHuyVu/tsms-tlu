package com.example.tsmstlu.services;

import java.util.List;

public interface BaseService<T, ListDto, DetailDto, CreateDto, UpdateDto, ID> {
    List<ListDto> getAll();
    DetailDto getById(ID id);
    DetailDto create(CreateDto dto);
    DetailDto update(ID id, UpdateDto dto);
    void delete(ID id);
}

