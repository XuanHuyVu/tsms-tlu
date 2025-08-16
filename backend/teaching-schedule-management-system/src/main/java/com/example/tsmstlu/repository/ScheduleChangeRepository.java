package com.example.tsmstlu.repository;

import com.example.tsmstlu.entity.ScheduleChangeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleChangeRepository extends JpaRepository<ScheduleChangeEntity, Long> {
}
