package com.example.tsmstlu.repository;

import com.example.tsmstlu.entity.TeachingScheduleEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeachingScheduleRepository extends JpaRepository<TeachingScheduleEntity, Long> {
    @Query("SELECT ts FROM TeachingScheduleEntity ts WHERE ts.teacher.id = :teacherId")
    List<TeachingScheduleEntity> findByTeacherId(@Param("teacherId") Long teacherId);

}
