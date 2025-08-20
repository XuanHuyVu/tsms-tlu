//package com.example.tsmstlu.controller.teacher;
//
//import com.example.tsmstlu.dto.teaching_log.TeacherStatsDto;
//import com.example.tsmstlu.service.TeachingLogService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/teacher/stats")
//@PreAuthorize("hasRole('TEACHER')")
//public class TeacherStatsController {
//
//    private final TeachingLogService teachingLogService;
//
//    @GetMapping("/me")
//    public ResponseEntity<List<TeacherStatsDto>> getMyStats(@RequestParam(required = false) Long semesterId, @AuthenticationPrincipal JwtUserDetails jwtUser) {
//        Long teacherId = jwtUser.getTeacherId();
//        List<TeacherStatsDto> stats = teachingLogService.getTeacherStats(teacherId, semesterId);
//
//        return stats != null && !stats.isEmpty()
//                ? ResponseEntity.ok(stats)
//                : ResponseEntity.notFound().build();
//    }
//
//}
//
