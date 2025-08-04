package com.example.tsmstlu.dtos.user;

import lombok.*;

@Data
@AllArgsConstructor
public class JwtResponseDto {
    private String token;
    private UserDto user;
}
