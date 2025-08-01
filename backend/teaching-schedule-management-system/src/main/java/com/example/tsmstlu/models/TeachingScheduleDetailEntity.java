package com.example.tsmstlu.models;

import jakarta.persistence.*;
import lombok.*;

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
        THU_HAI("Thứ hai"),
        THU_BA("Thứ ba"),
        THU_TU("Thứ tư"),
        THU_NAM("Thứ năm"),
        THU_SAU("Thứ sáu"),
        THU_BAY("Thứ bảy"),
        CHU_NHAT("Chủ nhật");

        private final String label;

        DayOfWeek(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    public enum LessonType {
        LY_THUYET("Lý thuyết"),
        THUC_HANH("Thực hành");

        private final String label;

        LessonType(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
