package com.example.tsmstlu.controllers;

import com.example.tsmstlu.dtos.user.*;
import com.example.tsmstlu.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto loginDto) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(auth);
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        String token = jwtUtils.generateToken(userDetails.getUsername());

        UserDto userDto = UserDto.builder()
                .username(userDetails.getUsername())
                .role(userDetails.getAuthorities().iterator().next().getAuthority())
                .build();

        return ResponseEntity.ok(new JwtResponseDto(token, userDto));
    }
}
