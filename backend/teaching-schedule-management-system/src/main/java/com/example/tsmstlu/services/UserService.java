package com.example.tsmstlu.services;

import com.example.tsmstlu.dtos.user.UserCreateDto;
import com.example.tsmstlu.dtos.user.UserDto;
import com.example.tsmstlu.models.UserEntity;

public interface UserService extends BaseService<UserEntity, UserDto, UserDto, UserCreateDto, UserCreateDto, Long> {
}
