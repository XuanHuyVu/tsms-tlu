package com.example.tsmstlu.utils;

import com.example.tsmstlu.dto.department.DepartmentCreateDto;
import com.example.tsmstlu.dto.department.DepartmentDto;
import com.example.tsmstlu.dto.department.DepartmentListDto;
import com.example.tsmstlu.dto.department.DepartmentUpdateDto;
import com.example.tsmstlu.dto.faculty.FacultyDto;
import com.example.tsmstlu.dto.semester.SemesterDto;
import com.example.tsmstlu.dto.teacher.*;
import com.example.tsmstlu.dto.user.UserCreateDto;
import com.example.tsmstlu.dto.user.UserDto;
import com.example.tsmstlu.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MapperUtils {
    // Semester
    SemesterDto toSemesterDto(SemesterEntity entity);
    SemesterEntity toSemesterEntity(SemesterDto dto);


    // Faculty
    FacultyDto toFacultyDto(FacultyEntity entity);
    FacultyEntity toFacultyEntity(FacultyDto dto);

    // Department
    DepartmentDto toDepartmentDto(DepartmentEntity entity);
    DepartmentListDto toDepartmentListDto(DepartmentEntity entity);
    DepartmentEntity toDepartmentEntity(DepartmentCreateDto dto);
    DepartmentEntity toDepartmentEntity(DepartmentUpdateDto dto);
    void copyEntity(DepartmentUpdateDto dto, @MappingTarget DepartmentEntity entity);


    // User
    UserDto toUserDto(UserEntity entity);
    UserEntity toEntity(UserDto dto);
    UserCreateDto toUserCreateDto(UserEntity entity);
    UserEntity toEntity(UserCreateDto dto);

    // Teacher
    TeacherListDto toTeacherListDto(TeacherEntity entity);
    TeacherDto toTeacherDetailDto(TeacherEntity entity);
    TeacherEntity toTeacherEntity(TeacherCreateDto dto);
    TeacherEntity toTeacherEntity(TeacherUpdateDto dto);

    TeacherUpdateDto toTeacherUpdateDto(TeacherEntity entity);
    TeacherCreateDto toTeacherCreateDto(TeacherDto entity);

    void copyEntity(TeacherUpdateDto dto, @MappingTarget TeacherEntity entity);
}
