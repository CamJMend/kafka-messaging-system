package com.kafka.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.kafka.demo.dto.MessageDto;

@Service
public class WebSocketService {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketService.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendMessageToReact(MessageDto messageDto) {
        try {
            logger.info("Enviando mensaje vía WebSocket: {}", messageDto);
            messagingTemplate.convertAndSend("/topic/messages", messageDto);
        } catch (Exception e) {
            logger.error("Error enviando mensaje vía WebSocket", e);
        }
    }
}