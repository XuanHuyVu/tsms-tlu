package com.example.tsmstlu.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "semesters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SemesterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20, nullable = false, unique = true)
    private String code;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 20, nullable = false)
    private String academicYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('1', '2', 'Hè')")
    private Term term;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    public enum Term {
        MOT("1"),
        HAI("2"),
        HE("Hè");

        private final String label;

        Term(String label) {
            this.label = label;
        }

        @Override
        public String toString() {
            return label;
        }
    }
}
