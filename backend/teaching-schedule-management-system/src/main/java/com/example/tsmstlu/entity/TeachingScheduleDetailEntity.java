package com.example.tsmstlu.entity;

import com.example.tsmstlu.common.TableNameContants;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = TableNameContants.TEACHING_SCHEDULE_DETAIL)
public class TeachingScheduleDetailEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "schedule_id", nullable = false)
    private TeachingScheduleEntity schedule;

    @Column(name = "teaching_date", nullable = false)
    private String teachingDate;

    @Column(name = "period_start", nullable = false)
    private String periodStart;

    @Column(name = "period_end", nullable = false)
    private String periodEnd;

    private String type;
    private String status;
}
