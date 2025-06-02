const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  
  async sendMessage(message) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      return { success: true, message: result };
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      return { success: false, error: error.message };
    }
  }

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      return { success: true, message: result };
    } catch (error) {
      console.error('Error verificando salud del servicio:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para determinar el tópico basado en el contenido del mensaje
  determineTopicFromMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('topico1')) {
      return 'topico1';
    } else if (lowerMessage.includes('topico2')) {
      return 'topico2';
    } else if (lowerMessage.includes('topico3')) {
      return 'topico3';
    } else {
      return 'topico1'; // Por defecto
    }
  }

  // Método para obtener estadísticas simuladas
  getMessageStats(messages) {
    const stats = {
      total: messages.length,
      byTopic: {},
      byPartition: {},
      lastHour: 0
    };

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    messages.forEach(msg => {
      // Estadísticas por tópico
      if (!stats.byTopic[msg.topic]) {
        stats.byTopic[msg.topic] = { total: 0, partition0: 0, partition1: 0 };
      }
      stats.byTopic[msg.topic].total++;
      stats.byTopic[msg.topic][`partition${msg.partition}`]++;

      // Estadísticas por partición
      const partitionKey = `${msg.topic}-${msg.partition}`;
      if (!stats.byPartition[partitionKey]) {
        stats.byPartition[partitionKey] = 0;
      }
      stats.byPartition[partitionKey]++;

      // Mensajes en la última hora
      if (new Date(msg.timestamp) > oneHourAgo) {
        stats.lastHour++;
      }
    });

    return stats;
  }

  // Método para formatear timestamps
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return {
      time: date.toLocaleTimeString(),
      date: date.toLocaleDateString(),
      iso: date.toISOString()
    };
  }

  // Método para validar mensajes
  validateMessage(message) {
    if (!message || typeof message !== 'string') {
      return { valid: false, error: 'El mensaje debe ser una cadena no vacía' };
    }

    if (message.trim().length === 0) {
      return { valid: false, error: 'El mensaje no puede estar vacío' };
    }

    if (message.length > 1000) {
      return { valid: false, error: 'El mensaje no puede exceder 1000 caracteres' };
    }

    return { valid: true };
  }
}

// Crear instancia singleton
const apiService = new ApiService();

export default apiService;