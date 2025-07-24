package com.example.tsmstlu.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "class_sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassSectionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private CourseEntity course;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private TeacherEntity teacher;

    @Column(length = 50)
    private String room;
}
