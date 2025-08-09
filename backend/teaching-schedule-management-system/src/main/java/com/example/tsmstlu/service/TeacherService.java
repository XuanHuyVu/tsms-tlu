package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.teacher.TeacherCreateDto;
import com.example.tsmstlu.dto.teacher.TeacherDto;
import com.example.tsmstlu.dto.teacher.TeacherListDto;
import com.example.tsmstlu.dto.teacher.TeacherUpdateDto;
import com.example.tsmstlu.entity.TeacherEntity;

import java.util.List;

public interface TeacherService  extends BaseService<TeacherEntity, TeacherListDto, TeacherDto, TeacherCreateDto, TeacherUpdateDto, Long> {
}
