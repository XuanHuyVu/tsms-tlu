package com.example.tsmstlu.controllers.admin;

import com.example.tsmstlu.dtos.user.UserCreateDto;
import com.example.tsmstlu.dtos.user.UserDto;
import com.example.tsmstlu.models.UserEntity;
import com.example.tsmstlu.services.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")

public class UserController extends BaseController<UserEntity, UserDto,UserDto,UserCreateDto, UserCreateDto, Long> {
    public UserController(UserService userService) {
        super(userService);
    }
}
