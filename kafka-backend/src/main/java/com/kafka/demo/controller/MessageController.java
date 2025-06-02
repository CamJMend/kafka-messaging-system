package main.java.com.kafka.demo.controller;

import com.kafka.demo.service.KafkaProducerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody Map<String, String> request) {
        try {
            String message = request.get("message");
            
            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El mensaje no puede estar vacío");
            }

            logger.info("Recibida solicitud para enviar mensaje: {}", message);
            kafkaProducerService.sendMessage(message);
            
            return ResponseEntity.ok("Mensaje enviado exitosamente: " + message);
        } catch (Exception e) {
            logger.error("Error al enviar mensaje", e);
            return ResponseEntity.internalServerError().body("Error al enviar mensaje: " + e.getMessage());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Servicio de mensajes funcionando correctamente");
    }
}