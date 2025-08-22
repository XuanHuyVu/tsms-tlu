package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.student_class_section.*;
import com.example.tsmstlu.entity.*;
import com.example.tsmstlu.repository.*;
import com.example.tsmstlu.service.StudentClassSectionService;
import com.example.tsmstlu.utils.MapperUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class StudentClassSectionServiceImpl implements StudentClassSectionService {

    private final StudentClassSectionRepository studentClassSectionRepository;
    private final StudentRepository studentRepository;
    private final ClassSectionRepository classSectionRepository;
    private final MapperUtils mapper;

    @Override
    @Cacheable(value = "studentsInClassSection", key = "#classSectionId")
    public List<StudentInClassDto> getStudentsInClassSection(Long classSectionId) {
        List<StudentClassSectionEntity> students =
                studentClassSectionRepository.findAllByClassSectionIdFetchAll(classSectionId);

        return students.stream()
                .map(scs -> StudentInClassDto.builder()
                        .studentId(scs.getStudent().getId())
                        .fullName(scs.getStudent().getFullName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "classSectionsWithCount", key = "'all'")
    public List<StudentClassSectionListDto> getAllClassSectionsWithStudentCount() {
        List<Object[]> results = studentClassSectionRepository.getAllClassSectionsWithStudentCount();

        return results.stream()
                .map(obj -> {
                    ClassSectionEntity classSection = (ClassSectionEntity) obj[0];
                    Long studentCount = (Long) obj[1];
                    return StudentClassSectionListDto.builder()
                            .classSection(mapper.toClassSectionResponseDto(classSection))
                            .studentCount(studentCount)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "studentClassSection", key = "#classSectionId + '_' + #studentId")
    public StudentClassSectionDto getById(Long classSectionId, Long studentId) {
        StudentClassSectionId id = new StudentClassSectionId(studentId, classSectionId);
        StudentClassSectionEntity entity = studentClassSectionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found in this class section"));

        return mapper.toStudentClassSectionDto(entity);
    }

    @Override
    @CachePut(value = "studentClassSection", key = "#dto.classSectionId + '_' + #dto.studentId")
    @CacheEvict(value = {"studentsInClassSection", "classSectionsWithCount"}, allEntries = true)
    public StudentClassSectionDto create(StudentClassSectionCreateDto dto) {
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

        StudentClassSectionEntity saved = studentClassSectionRepository.save(entity);
        log.info("Added student {} to class section {}", dto.getStudentId(), dto.getClassSectionId());
        return mapper.toStudentClassSectionDto(saved);
    }


    @Override
    @CachePut(value = "studentClassSection", key = "#classSectionId + '_' + #studentId")
    @CacheEvict(value = {"studentsInClassSection", "classSectionsWithCount"}, allEntries = true)
    public StudentClassSectionDto update(Long classSectionId, Long studentId, StudentClassSectionCreateDto dto) {
        StudentClassSectionId id = new StudentClassSectionId(studentId, classSectionId);

        StudentClassSectionEntity entity = studentClassSectionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found in this class section"));

        StudentClassSectionEntity updated = studentClassSectionRepository.save(entity);
        return mapper.toStudentClassSectionDto(updated);
    }


    @Override
    @CacheEvict(value = {"studentClassSection", "studentsInClassSection", "classSectionsWithCount"}, allEntries = true)
    public void delete(Long classSectionId, Long studentId) {
        StudentClassSectionId id = new StudentClassSectionId(studentId, classSectionId);
        if (!studentClassSectionRepository.existsById(id)) {
            throw new EntityNotFoundException("Student not found in this class section");
        }
        studentClassSectionRepository.deleteById(id);
        log.info("Removed student {} from class section {}", studentId, classSectionId);
    }
}
