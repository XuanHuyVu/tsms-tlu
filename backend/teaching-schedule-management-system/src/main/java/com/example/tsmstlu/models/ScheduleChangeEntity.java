package com.example.tsmstlu.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "schedule_changes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleChangeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teaching_schedule_id")
    private TeachingScheduleEntity teachingSchedule;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChangeType type;

    private Date newDate;
    private String newRoom;
    private String reason;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt = new Date();

    public enum ChangeType {
        HUY("Hủy"),
        BU("Bù");

        private final String label;

        ChangeType(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}