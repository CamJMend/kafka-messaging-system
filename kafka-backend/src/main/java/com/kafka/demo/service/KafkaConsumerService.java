package com.kafka.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.TopicPartition;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import com.kafka.demo.dto.MessageDto;

@Service
public class KafkaConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);

    @Autowired
    private WebSocketService webSocketService;

    // Consumidores para topico1
    @KafkaListener(
        topicPartitions = @TopicPartition(topic = "topico1", partitions = {"0"}),
        groupId = "consumer-topico1-partition0"
    )
    public void consumeTopico1Partition0(@Payload String message,
                                        @Header(KafkaHeaders.TOPIC) String topic,
                                        @Header(KafkaHeaders.PARTITION_ID) int partition,
                                        @Header(KafkaHeaders.OFFSET) long offset) {
        
        String consumerGroup = "consumer-topico1-partition0";
        logger.info("Consumidor {}: Recibido mensaje '{}' de tópico '{}' partición {}", 
                   consumerGroup, message, topic, partition);
        
        MessageDto messageDto = new MessageDto(message, topic, partition, offset, consumerGroup);
        webSocketService.sendMessageToReact(messageDto);
    }

    @KafkaListener(
        topicPartitions = @TopicPartition(topic = "topico1", partitions = {"1"}),
        groupId = "consumer-topico1-partition1"
    )
    public void consumeTopico1Partition1(@Payload String message,
                                        @Header(KafkaHeaders.TOPIC) String topic,
                                        @Header(KafkaHeaders.PARTITION_ID) int partition,
                                        @Header(KafkaHeaders.OFFSET) long offset) {
        
        String consumerGroup = "consumer-topico1-partition1";
        logger.info("Consumidor {}: Recibido mensaje '{}' de tópico '{}' partición {}", 
                   consumerGroup, message, topic, partition);
        
        MessageDto messageDto = new MessageDto(message, topic, partition, offset, consumerGroup);
        webSocketService.sendMessageToReact(messageDto);
    }

    // Consumidores para topico2
    @KafkaListener(
        topicPartitions = @TopicPartition(topic = "topico2", partitions = {"0"}),
        groupId = "consumer-topico2-partition0"
    )
    public void consumeTopico2Partition0(@Payload String message,
                                        @Header(KafkaHeaders.TOPIC) String topic,
                                        @Header(KafkaHeaders.PARTITION_ID) int partition,
                                        @Header(KafkaHeaders.OFFSET) long offset) {
        
        String consumerGroup = "consumer-topico2-partition0";
        logger.info("Consumidor {}: Recibido mensaje '{}' de tópico '{}' partición {}", 
                   consumerGroup, message, topic, partition);
        
        MessageDto messageDto = new MessageDto(message, topic, partition, offset, consumerGroup);
        webSocketService.sendMessageToReact(messageDto);
    }

    @KafkaListener(
        topicPartitions = @TopicPartition(topic = "topico2", partitions = {"1"}),
        groupId = "consumer-topico2-partition1"
    )
    public void consumeTopico2Partition1(@Payload String message,
                                        @Header(KafkaHeaders.TOPIC) String topic,
                                        @Header(KafkaHeaders.PARTITION_ID) int partition,
                                        @Header(KafkaHeaders.OFFSET) long offset) {
        
        String consumerGroup = "consumer-topico2-partition1";
        logger.info("Consumidor {}: Recibido mensaje '{}' de tópico '{}' partición {}", 
                   consumerGroup, message, topic, partition);
        
        MessageDto messageDto = new MessageDto(message, topic, partition, offset, consumerGroup);
        webSocketService.sendMessageToReact(messageDto);
    }

    // Consumidores para topico3
    @KafkaListener(
        topicPartitions = @TopicPartition(topic = "topico3", partitions = {"0"}),
        groupId = "consumer-topico3-partition0"
    )
    public void consumeTopico3Partition0(@Payload String message,
                                        @Header(KafkaHeaders.TOPIC) String topic,
                                        @Header(KafkaHeaders.PARTITION_ID) int partition,
                                        @Header(KafkaHeaders.OFFSET) long offset) {
        
        String consumerGroup = "consumer-topico3-partition0";
        logger.info("Consumidor {}: Recibido mensaje '{}' de tópico '{}' partición {}", 
                   consumerGroup, message, topic, partition);
        
        MessageDto messageDto = new MessageDto(message, topic, partition, offset, consumerGroup);
        webSocketService.sendMessageToReact(messageDto);
    }

    @KafkaListener(
        topicPartitions = @TopicPartition(topic = "topico3", partitions = {"1"}),
        groupId = "consumer-topico3-partition1"
    )
    public void consumeTopico3Partition1(@Payload String message,
                                        @Header(KafkaHeaders.TOPIC) String topic,
                                        @Header(KafkaHeaders.PARTITION_ID) int partition,
                                        @Header(KafkaHeaders.OFFSET) long offset) {
        
        String consumerGroup = "consumer-topico3-partition1";
        logger.info("Consumidor {}: Recibido mensaje '{}' de tópico '{}' partición {}", 
                   consumerGroup, message, topic, partition);
        
        MessageDto messageDto = new MessageDto(message, topic, partition, offset, consumerGroup);
        webSocketService.sendMessageToReact(messageDto);
    }
}