package com.example.tsmstlu.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "teaching_schedule_detail")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeachingScheduleDetailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private TeachingScheduleEntity schedule;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(nullable = false)
    private Integer period;

    @Column(nullable = false)
    private Integer duration;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LessonType type;

    public enum DayOfWeek {
        MONDAY("Thứ hai"),
        TUESDAY("Thứ ba"),
        WEDNESDAY("Thứ tư"),
        THURSDAY("Thứ năm"),
        FRIDAY("Thứ sáu"),
        SATURDAY("Thứ bảy"),
        SUNDAY("Chủ nhật");

        private final String label;

        DayOfWeek(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    public enum LessonType {
        THEORY("Lý thuyết"),
        PRACTICE("Thực hành");

        private final String label;

        LessonType(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
