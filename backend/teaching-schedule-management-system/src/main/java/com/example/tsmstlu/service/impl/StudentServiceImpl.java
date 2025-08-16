package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.student.*;
import com.example.tsmstlu.entity.FacultyEntity;
import com.example.tsmstlu.entity.MajorEntity;
import com.example.tsmstlu.entity.StudentEntity;
import com.example.tsmstlu.entity.UserEntity;
import com.example.tsmstlu.repository.FacultyRepository;
import com.example.tsmstlu.repository.MajorRepository;
import com.example.tsmstlu.repository.StudentRepository;
import com.example.tsmstlu.repository.UserRepository;
import com.example.tsmstlu.service.StudentService;
import com.example.tsmstlu.utils.MapperUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final MapperUtils mapperUtils;
    private final MajorRepository majorRepository;
    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;

    @Override
    public List<StudentListDto> getAll() {
        return studentRepository.findAll()
                .stream()
                .map(mapperUtils::toStudentListDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDto getById(Long id) {
        StudentEntity entity = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return mapperUtils.toStudentDto(entity);
    }

    @Override
    public StudentDto create(StudentCreateDto dto) {
        StudentEntity entity = mapperUtils.toStudentEntity(dto);

        if(dto.getUserId() != null) {
            UserEntity user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));
            entity.setUser(user);
        }

        if(dto.getMajorId() != null) {
            MajorEntity major = majorRepository.findById(dto.getMajorId())
                    .orElseThrow(() -> new RuntimeException("Major not found with id: " + dto.getMajorId()));
            entity.setMajor(major);
        }

        if(dto.getFacultyId() != null) {
            FacultyEntity faculty = facultyRepository.findById(dto.getFacultyId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found with id: " + dto.getFacultyId()));
            entity.setFaculty(faculty);
        }

        StudentEntity saved = studentRepository.save(entity);
        return mapperUtils.toStudentDto(saved);
    }

    @Override
    public StudentDto update(Long id, StudentUpdateDto dto) {
        StudentEntity entity = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        mapperUtils.copyEntity(dto, entity);

        if(dto.getUserId() != null) {
            UserEntity user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));
            entity.setUser(user);
        }

        if(dto.getMajorId() != null) {
            MajorEntity major = majorRepository.findById(dto.getMajorId())
                    .orElseThrow(() -> new RuntimeException("Major not found with id: " + dto.getMajorId()));
            entity.setMajor(major);
        }

        if(dto.getFacultyId() != null) {
            FacultyEntity faculty = facultyRepository.findById(dto.getFacultyId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found with id: " + dto.getFacultyId()));
            entity.setFaculty(faculty);
        }

        StudentEntity updated = studentRepository.save(entity);
        return mapperUtils.toStudentDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
        log.info("Deleted student with id: {}", id);
    }

    @Override
    public StudentProfileDto getStudentProfile(Long id) {
        StudentEntity student = studentRepository.findByUserId(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return mapperUtils.toStudentProfileDto(student);
    }

    @Override
    public StudentProfileDto getStudentProfileByUsername(String username) {
        return studentRepository.findByUserUsername(username)
                .map(mapperUtils::toStudentProfileDto)
                .orElseThrow(() -> new RuntimeException("Student not found with username: " + username));
    }
}
