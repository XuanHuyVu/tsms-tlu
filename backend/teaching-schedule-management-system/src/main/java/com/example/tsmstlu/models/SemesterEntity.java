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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('CHUA_BAT_DAU', 'DANG_DIEN_RA', 'DA_KET_THUC')")
    private SemesterStatus status;

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

    public enum SemesterStatus {
        CHUA_BAT_DAU("Chưa bắt đầu"),
        DANG_DIEN_RA("Đang diễn ra"),
        DA_KET_THUC("Đã kết thúc");

        private final String label;

        SemesterStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
