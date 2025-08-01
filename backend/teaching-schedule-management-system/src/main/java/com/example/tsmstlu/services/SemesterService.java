package com.example.tsmstlu.services;

import com.example.tsmstlu.dtos.semester.*;
import java.util.List;

public interface SemesterService {
    List<SemesterDto> getAll();
    SemesterDto getById(Long id);
    SemesterDto create(SemesterDto dto);
    SemesterDto update(Long id, SemesterDto dto);
    void delete(Long id);
}
