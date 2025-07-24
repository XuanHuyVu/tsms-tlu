package com.example.tsmstlu.models;

import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(unique = true, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    public enum Role {
        SINH_VIEN("Sinh viên"),
        GIAO_VIEN("Giáo viên"),
        QUAN_TRI_VIEN("Quản trị viên");

        private final String label;

        Role(String label) {
            this.label = label;
        }

        @JsonValue
        public String getLabel() {
            return label;
        }
    }
}