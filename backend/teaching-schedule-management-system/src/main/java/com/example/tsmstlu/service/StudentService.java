package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.student.StudentCreateDto;
import com.example.tsmstlu.dto.student.StudentDto;
import com.example.tsmstlu.dto.student.StudentListDto;
import com.example.tsmstlu.dto.student.StudentUpdateDto;
import com.example.tsmstlu.entity.StudentEntity;

public interface StudentService extends BaseService<StudentEntity, StudentListDto, StudentDto, StudentCreateDto, StudentUpdateDto, Long> {
}
