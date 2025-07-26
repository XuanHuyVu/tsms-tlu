package com.example.tsmstlu.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "teaching_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeachingScheduleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private TeacherEntity teacher;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectEntity subject;

    @ManyToOne
    @JoinColumn(name = "class_section_id", nullable = false)
    private ClassSectionEntity classSection;

    @ManyToOne
    @JoinColumn(name = "semester_id", nullable = false)
    private SemesterEntity semester;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TeachingScheduleStatus status;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

    public enum TeachingScheduleStatus {
        CHO_DUYET("Chờ duyệt"),
        DA_DUYET("Đã duyệt"),
        DA_HUY("Đã hủy");

        private final String label;

        TeachingScheduleStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
