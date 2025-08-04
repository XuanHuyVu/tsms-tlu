package com.example.tsmstlu.utils;

import com.example.tsmstlu.dtos.faculty.FacultyDto;
import com.example.tsmstlu.models.*;
import com.example.tsmstlu.dtos.semester.SemesterDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MapperUtils {
    //Semesters
    SemesterDto toDto(SemesterEntity entity);
    SemesterEntity toEntity(SemesterDto dto);

    // Faculties
    FacultyDto toDto(FacultyEntity entity);
    FacultyEntity toEntity(FacultyDto dto);
}
