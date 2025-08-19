package com.example.tsmstlu.controller.teacher;

import com.example.tsmstlu.dto.schedule_change.ScheduleChangeDto;
import com.example.tsmstlu.service.ScheduleChangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teacher/schedule-change-list")
@PreAuthorize("hasRole('TEACHER')")
public class ScheduleChangeListController {
    private final ScheduleChangeService scheduleChangeService;

    @GetMapping
    public ResponseEntity<List<ScheduleChangeDto>> getAll() {
        List<ScheduleChangeDto> list = scheduleChangeService.getAll();
        return ResponseEntity.ok(list);
    }
}
