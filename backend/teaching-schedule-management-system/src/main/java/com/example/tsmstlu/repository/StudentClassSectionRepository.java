package com.example.tsmstlu.repository;

import com.example.tsmstlu.entity.StudentClassSectionEntity;
import com.example.tsmstlu.entity.StudentClassSectionId;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentClassSectionRepository extends JpaRepository<StudentClassSectionEntity, Long> {
    @Query("""
        select scs from StudentClassSectionEntity scs
        join fetch scs.student s
        join fetch scs.classSection cs
        left join fetch cs.subject sub
        left join fetch cs.teacher t
        where cs.id = :classSectionId
    """)
    List<StudentClassSectionEntity> findAllByClassSectionIdFetchAll(@Param("classSectionId") Long classSectionId);

    boolean existsById(StudentClassSectionId id);
    void deleteById(StudentClassSectionId id);
}
