package com.example.tsmstlu.utils;

import com.example.tsmstlu.dto.department.DepartmentDto;
import com.example.tsmstlu.dto.faculty.FacultyDto;
import com.example.tsmstlu.dto.user.UserCreateDto;
import com.example.tsmstlu.dto.user.UserDto;
import com.example.tsmstlu.entity.*;
import com.example.tsmstlu.dto.semester.SemesterDto;
import org.mapstruct.Mapper;

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

    //Departments
    DepartmentEntity toDepartmentEntity(DepartmentDto dto);
    DepartmentDto toDepartmentDto(DepartmentEntity entity);
}

