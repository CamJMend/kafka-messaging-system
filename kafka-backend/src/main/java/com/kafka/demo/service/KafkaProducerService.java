package main.java.com.kafka.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;

import java.util.Random;

@Service
public class KafkaProducerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);
    
    private static final String TOPIC_1 = "topico1";
    private static final String TOPIC_2 = "topico2";
    private static final String TOPIC_3 = "topico3";
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    private Random random = new Random();

    public void sendMessage(String message) {
        String topicToSend = determineTopicFromMessage(message);
        int partition = random.nextInt(2); // 0 o 1 para las dos particiones
        
        logger.info("Enviando mensaje: '{}' al tópico: '{}' partición: {}", message, topicToSend, partition);
        
        ListenableFuture<SendResult<String, String>> future = 
            kafkaTemplate.send(topicToSend, partition, null, message);
        
        future.addCallback(new ListenableFutureCallback<SendResult<String, String>>() {
            @Override
            public void onSuccess(SendResult<String, String> result) {
                logger.info("Mensaje enviado exitosamente: '{}' con offset: {}", 
                    message, result.getRecordMetadata().offset());
            }

            @Override
            public void onFailure(Throwable ex) {
                logger.error("Error al enviar mensaje: '{}'", message, ex);
            }
        });
    }
    
    private String determineTopicFromMessage(String message) {
        String lowerMessage = message.toLowerCase();
        
        if (lowerMessage.contains("topico1")) {
            return TOPIC_1;
        } else if (lowerMessage.contains("topico2")) {
            return TOPIC_2;
        } else if (lowerMessage.contains("topico3")) {
            return TOPIC_3;
        } else {
            // Por defecto, enviar a topico1 si no se especifica
            logger.warn("No se encontró palabra clave en el mensaje. Enviando a topico1 por defecto.");
            return TOPIC_1;
        }
    }
}