package com.example.tsmstlu.utils;

import com.example.tsmstlu.dto.class_section.ClassSectionCreateDto;
import com.example.tsmstlu.dto.class_section.ClassSectionDto;
import com.example.tsmstlu.dto.class_section.ClassSectionListDto;
import com.example.tsmstlu.dto.class_section.ClassSectionUpdateDto;
import com.example.tsmstlu.dto.department.DepartmentCreateDto;
import com.example.tsmstlu.dto.department.DepartmentDto;
import com.example.tsmstlu.dto.department.DepartmentListDto;
import com.example.tsmstlu.dto.department.DepartmentUpdateDto;
import com.example.tsmstlu.dto.faculty.FacultyDto;
import com.example.tsmstlu.dto.major.MajorCreateDto;
import com.example.tsmstlu.dto.major.MajorDto;
import com.example.tsmstlu.dto.major.MajorListDto;
import com.example.tsmstlu.dto.major.MajorUpdateDto;
import com.example.tsmstlu.dto.room.RoomCreateDto;
import com.example.tsmstlu.dto.room.RoomDto;
import com.example.tsmstlu.dto.room.RoomListDto;
import com.example.tsmstlu.dto.room.RoomUpdateDto;
import com.example.tsmstlu.dto.schedule_change.*;
import com.example.tsmstlu.dto.semester.SemesterDto;
import com.example.tsmstlu.dto.student.*;
import com.example.tsmstlu.dto.student_class_section.StudentClassSectionCreateDto;
import com.example.tsmstlu.dto.student_class_section.StudentClassSectionDto;
import com.example.tsmstlu.dto.student_class_section.StudentClassSectionUpdateDto;
import com.example.tsmstlu.dto.subject.SubjectCreateDto;
import com.example.tsmstlu.dto.subject.SubjectDto;
import com.example.tsmstlu.dto.subject.SubjectListDto;
import com.example.tsmstlu.dto.subject.SubjectUpdateDto;
import com.example.tsmstlu.dto.teacher.*;
import com.example.tsmstlu.dto.teaching_schedule.*;
import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailCreateDto;
import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailDto;
import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailResponseDto;
import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailUpdateDto;
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
    TeacherProfileDto toTeacherProfileDto(TeacherEntity entity);
    TeacherEntity toTeacherEntity(TeacherCreateDto dto);
    TeacherEntity toTeacherEntity(TeacherUpdateDto dto);
    TeacherUpdateDto toTeacherUpdateDto(TeacherEntity entity);
    TeacherCreateDto toTeacherCreateDto(TeacherDto entity);

    void copyEntity(TeacherUpdateDto dto, @MappingTarget TeacherEntity entity);

     //Room
     RoomListDto toRoomListDto(RoomEntity entity);
     RoomDto toRoomDetailDto(RoomEntity entity);
     RoomCreateDto toRoomCreateDto(RoomEntity entity);
     RoomUpdateDto toRoomUpdateDto(RoomEntity entity);
     RoomEntity toRoomEntity(RoomCreateDto dto);
     RoomEntity toRoomEntity(RoomUpdateDto dto);
     void copyEntity(RoomUpdateDto dto, @MappingTarget RoomEntity entity);

     //Subject
     SubjectListDto toSubjectListDto(SubjectEntity entity);
     SubjectDto toSubjectDetailDto(SubjectEntity entity);
     SubjectCreateDto toSubjectCreateDto(SubjectEntity entity);
     SubjectUpdateDto toSubjectUpdateDto(SubjectEntity entity);
     SubjectEntity toSubjectEntity(SubjectCreateDto dto);
     SubjectEntity toSubjectEntity(SubjectUpdateDto dto);
     void copyEntity(SubjectUpdateDto dto, @MappingTarget SubjectEntity entity);

     //Class Section
    ClassSectionListDto toClassSectionListDto(ClassSectionEntity entity);
    ClassSectionDto toClassSectionDetailDto(ClassSectionEntity entity);
    ClassSectionCreateDto toClassSectionCreateDto(ClassSectionEntity entity);
    ClassSectionUpdateDto toClassSectionUpdateDto(ClassSectionEntity entity);
    ClassSectionEntity toClassSectionEntity(ClassSectionCreateDto dto);
    ClassSectionEntity toClassSectionEntity(ClassSectionUpdateDto dto);
    void copyEntity(ClassSectionUpdateDto dto, @MappingTarget ClassSectionEntity entity);

    // Teaching Schedule
    TeachingScheduleDto toTeachingScheduleDto(TeachingScheduleEntity entity);
    TeachingScheduleResponseDto toTeachingScheduleResponseDto(TeachingScheduleEntity entity);
    TeachingScheduleListDto toTeachingScheduleListDto(TeachingScheduleEntity entity);
    TeachingScheduleEntity toTeachingScheduleEntity(TeachingScheduleCreateDto dto);
    TeachingScheduleEntity toTeachingScheduleEntity(TeachingScheduleUpdateDto dto);
    void copyEntity(TeachingScheduleUpdateDto dto, @MappingTarget TeachingScheduleEntity entity);

    // Teaching Schedule Detail
    TeachingScheduleDetailResponseDto toTeachingScheduleDetailResponseDto(TeachingScheduleDetailEntity entity);
    TeachingScheduleDetailDto toTeachingScheduleDetailDto(TeachingScheduleDetailEntity entity);
    TeachingScheduleDetailEntity toTeachingScheduleDetailEntity(TeachingScheduleDetailCreateDto dto);
    TeachingScheduleDetailEntity toTeachingScheduleDetailEntity(TeachingScheduleDetailUpdateDto dto);
    void copyEntity(TeachingScheduleDetailUpdateDto dto, @MappingTarget TeachingScheduleDetailEntity entity);

    // schedule change
    ScheduleChangeDto toScheduleChangeListDto(ScheduleChangeEntity entity);
    ScheduleChangeDto toScheduleChangeDto(ScheduleChangeEntity entity);
    ScheduleChangeApprovedDto toScheduleChangeApprovedDto(ScheduleChangeEntity entity);
    ClassCancelDto toClassCancelDto(ScheduleChangeEntity entity);
    ScheduleChangeEntity toScheduleChangeEntity(ClassCancelCreateDto dto);
    MakeUpClassDto toMakeUpClassDto(ScheduleChangeEntity entity);
    ScheduleChangeEntity toScheduleChangeEntity(MakeUpClassCreateDto dto);

    // major
    MajorListDto toMajorListDto(MajorEntity entity);
    MajorDto toMajorDto(MajorEntity entity);
    MajorEntity toMajorEntity(MajorCreateDto dto);
    MajorEntity toMajorEntity(MajorUpdateDto dto);
    void copyEntity(MajorUpdateDto dto, @MappingTarget MajorEntity entity);

    // student
    StudentListDto toStudentListDto(StudentEntity entity);
    StudentDto toStudentDto(StudentEntity entity);
    StudentProfileDto toStudentProfileDto(StudentEntity entity);
    StudentEntity toStudentEntity(StudentCreateDto dto);
    StudentEntity toStudentEntity(StudentUpdateDto dto);
    void copyEntity(StudentUpdateDto dto, @MappingTarget StudentEntity entity);


    // student-class-section
    StudentClassSectionDto toStudentClassSectionDto(StudentClassSectionEntity entity);
    StudentClassSectionEntity toStudentClassSectionEntity(StudentClassSectionCreateDto dto);
    StudentClassSectionEntity toStudentClassSectionEntity(StudentClassSectionUpdateDto dto);
    void copyEntity(StudentClassSectionUpdateDto dto, @MappingTarget StudentClassSectionEntity entity);
}