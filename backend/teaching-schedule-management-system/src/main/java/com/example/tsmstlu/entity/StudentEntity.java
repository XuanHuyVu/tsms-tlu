package com.example.tsmstlu.entity;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    @Column(nullable = false, unique = true, length = 20)
    private String studentCode;

    private String fullName;
    private String className;
    private Integer enrollmentYear;
}
