package com.example.tsmstlu.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Table(name = "teaching_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeachingLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teaching_schedule_id", nullable = false)
    private TeachingScheduleEntity teachingSchedule;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private TeacherEntity teacher;

    @Column(nullable = false)
    private Date actualDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LogStatus status;

    private String note;

    public enum LogStatus {
        HOAN_THANH("Hoàn thành"),
        DA_HUY("Đã hủy"),
        BU("Bù");

        private final String label;

        LogStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}

