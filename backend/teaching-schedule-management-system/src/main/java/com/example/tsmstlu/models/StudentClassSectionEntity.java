package com.example.tsmstlu.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Table(name = "student_class_sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassSectionEntity {

    @EmbeddedId
    private StudentClassSectionId id;

    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private StudentEntity student;

    @ManyToOne
    @MapsId("classSectionId")
    @JoinColumn(name = "class_section_id")
    private ClassSectionEntity classSection;

    private String practiseGroup;

    @Temporal(TemporalType.TIMESTAMP)
    private Date enrolledAt = new Date();
}


