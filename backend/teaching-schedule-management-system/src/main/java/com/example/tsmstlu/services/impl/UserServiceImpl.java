package com.example.tsmstlu.services.impl;

import com.example.tsmstlu.dtos.user.UserCreateDto;
import com.example.tsmstlu.dtos.user.UserDto;
import com.example.tsmstlu.models.UserEntity;
import com.example.tsmstlu.repositories.UserRepository;
import com.example.tsmstlu.services.UserService;
import com.example.tsmstlu.utils.MapperUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends BaseServiceImpl<UserEntity,UserDto,UserDto,UserCreateDto,UserCreateDto,Long> implements UserService {

    private final MapperUtils mapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository repository, MapperUtils mapper, PasswordEncoder passwordEncoder) {
        super(repository);
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected UserDto toListDto(UserEntity entity) {
        return mapper.toUserDto(entity);
    }

    @Override
    protected UserDto toDetailDto(UserEntity entity) {
        return mapper.toUserDto(entity);
    }

    @Override
    protected UserEntity fromCreateDto(UserCreateDto dto) {
        UserEntity entity = mapper.toEntity(dto);
        entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        return entity;
    }

    @Override
    protected UserEntity fromUpdateDto(UserCreateDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void setId(UserEntity entity, Long id) {
        entity.setId(id);
    }
}
