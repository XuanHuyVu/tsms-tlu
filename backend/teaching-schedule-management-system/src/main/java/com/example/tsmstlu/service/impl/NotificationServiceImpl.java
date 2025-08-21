package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.notification.*;
import com.example.tsmstlu.entity.*;
import com.example.tsmstlu.utils.MapperUtils;
import com.example.tsmstlu.repository.*;
import com.example.tsmstlu.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationRecipientRepository recipientRepository;
    private final UserRepository userRepository;
    private final ScheduleChangeRepository scheduleChangeRepository;
    private final MapperUtils mapper;

    @Override
    @Transactional
    public NotificationDto createNotification(NotificationCreateRequestDto request) {
        NotificationEntity entity = mapper.toNotificationEntity(request);

        if (request.getRelatedScheduleChangeId() != null) {
            ScheduleChangeEntity sc = scheduleChangeRepository.findById(request.getRelatedScheduleChangeId())
                    .orElseThrow(() -> new RuntimeException("ScheduleChange not found"));
            entity.setRelatedScheduleChange(sc);
        }

        entity = notificationRepository.save(entity);

        // Gán recipients
        List<NotificationRecipientEntity> recipients = new ArrayList<>();
        for (Long userId : request.getRecipientUserIds()) {
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            NotificationRecipientEntity rec = NotificationRecipientEntity.builder()
                    .notification(entity)
                    .user(user)
                    .isRead(false)
                    .build();
            recipients.add(rec);
        }
        recipientRepository.saveAll(recipients);
        entity.setRecipients(recipients);

        return mapper.toNotificationDto(entity);
    }

    @Override
    public List<NotificationDto> getAll() {
        return mapper.toNotificationDtoList(notificationRepository.findAll());
    }

    @Override
    public List<NotificationDto> getByUser(Long userId) {
        List<NotificationRecipientEntity> recs = recipientRepository.findByUserId(userId);
        List<NotificationEntity> notifications = recs.stream()
                .map(NotificationRecipientEntity::getNotification)
                .toList();
        return mapper.toNotificationDtoList(notifications);
    }

    @Override
    @Transactional
    public void markAsRead(Long recipientId) {
        NotificationRecipientEntity rec = recipientRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        rec.setIsRead(true);
        recipientRepository.save(rec);
    }

    @Override
    public List<UserNotificationDto> getByUsername(String username) {
        List<NotificationRecipientEntity> recipientEntities = recipientRepository.findByUserUsername(username);
        return recipientEntities.stream()
                .map(mapper::toUserNotificationDto)
                .toList();
    }
}