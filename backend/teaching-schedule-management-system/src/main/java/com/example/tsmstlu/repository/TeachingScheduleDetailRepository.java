package com.example.tsmstlu.repository;

import com.example.tsmstlu.entity.TeachingScheduleDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeachingScheduleDetailRepository extends JpaRepository<TeachingScheduleDetailEntity, Long> {
}
