package com.example.tsmstlu.repositories;

import com.example.tsmstlu.models.SemesterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SemesterRepository extends JpaRepository<SemesterEntity, Long> {
}
