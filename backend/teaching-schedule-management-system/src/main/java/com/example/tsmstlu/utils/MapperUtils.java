package com.example.tsmstlu.utils;

import com.example.tsmstlu.dtos.faculty.FacultyDto;
import com.example.tsmstlu.dtos.user.UserCreateDto;
import com.example.tsmstlu.dtos.user.UserDto;
import com.example.tsmstlu.dtos.user.UserLoginDto;
import com.example.tsmstlu.models.*;
import com.example.tsmstlu.dtos.semester.SemesterDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MapperUtils {
    // Semesters
    SemesterDto toSemesterDto(SemesterEntity entity);
    SemesterEntity toSemesterEntity(SemesterDto dto);

    // Faculties
    FacultyDto toFacultyDto(FacultyEntity entity);
    FacultyEntity toFacultyEntity(FacultyDto dto);

    // Users
    UserDto toUserDto(UserEntity entity);
    UserEntity toEntity(UserDto dto);

    UserCreateDto toUserCreateDto(UserEntity entity);
    UserEntity toEntity(UserCreateDto dto);
//    void copyEntity(UserDto dto, @MappingTarget UserEntity entity);
}

