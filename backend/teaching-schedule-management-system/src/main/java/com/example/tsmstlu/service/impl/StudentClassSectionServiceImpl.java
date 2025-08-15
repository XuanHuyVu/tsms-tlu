package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.student_class_section.StudentClassSectionCreateDto;
import com.example.tsmstlu.dto.student_class_section.StudentInClassDto;
import com.example.tsmstlu.entity.*;
import com.example.tsmstlu.repository.*;
import com.example.tsmstlu.service.StudentClassSectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class StudentClassSectionServiceImpl implements StudentClassSectionService {

    private final StudentClassSectionRepository studentClassSectionRepository;
    private final StudentRepository studentRepository;
    private final ClassSectionRepository classSectionRepository;

    @Override
    public List<StudentInClassDto> getStudentsInClassSection(Long classSectionId) {
        List<StudentClassSectionEntity> students =
                studentClassSectionRepository.findAllByClassSectionIdFetchAll(classSectionId);

        return students.stream()
                .map(scs -> StudentInClassDto.builder()
                        .studentId(scs.getStudent().getId())
                        .fullName(scs.getStudent().getFullName())
                        .practiseGroup(scs.getPractiseGroup())
                        .build())
                .toList();
    }

    @Override
    public StudentClassSectionCreateDto create(StudentClassSectionCreateDto dto) {
        StudentEntity student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + dto.getStudentId()));

        ClassSectionEntity classSection = classSectionRepository.findById(dto.getClassSectionId())
                .orElseThrow(() -> new EntityNotFoundException("ClassSection not found with ID: " + dto.getClassSectionId()));

        StudentClassSectionId id = new StudentClassSectionId(dto.getStudentId(), dto.getClassSectionId());
        if (studentClassSectionRepository.existsById(id)) {
            throw new IllegalArgumentException("Student already exists in this class section");
        }

        StudentClassSectionEntity entity = new StudentClassSectionEntity();
        entity.setId(id);
        entity.setStudent(student);
        entity.setClassSection(classSection);
        entity.setPractiseGroup(dto.getPractiseGroup());

        studentClassSectionRepository.save(entity);

        log.info("Added student {} to class section {}", dto.getStudentId(), dto.getClassSectionId());
        return dto;
    }

    @Override
    public void delete(Long classSectionId, Long studentId) {
        StudentClassSectionId id = new StudentClassSectionId(studentId, classSectionId);
        if (!studentClassSectionRepository.existsById(id)) {
            throw new EntityNotFoundException("Student not found in this class section");
        }
        studentClassSectionRepository.deleteById(id);
        log.info("Removed student {} from class section {}", studentId, classSectionId);
    }
}
