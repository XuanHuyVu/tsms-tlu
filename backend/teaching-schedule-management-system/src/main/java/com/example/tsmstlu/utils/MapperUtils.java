package com.example.tsmstlu.utils;

import com.example.tsmstlu.models.SemesterEntity;
import com.example.tsmstlu.dtos.semester.SemesterDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MapperUtils {
    //Semesters
    SemesterDto toDto(SemesterEntity entity);
    SemesterEntity toEntity(SemesterDto dto);
}
