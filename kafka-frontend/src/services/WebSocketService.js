import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.messageHandlers = [];
    this.connectionHandlers = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        // Crear conexión SockJS
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);
        
        // Configurar headers
        const headers = {};
        
        // Deshabilitar logs de debug
        this.stompClient.debug = null;
        
        // Conectar
        this.stompClient.connect(
          headers,
          (frame) => {
            console.log('Conectado a WebSocket:', frame);
            this.isConnected = true;
            this.reconnectAttempts = 0;
            
            // Suscribirse al tópico de mensajes
            this.stompClient.subscribe('/topic/messages', (message) => {
              try {
                const messageData = JSON.parse(message.body);
                this.notifyMessageHandlers(messageData);
              } catch (error) {
                console.error('Error procesando mensaje:', error);
              }
            });
            
            this.notifyConnectionHandlers(true);
            resolve();
          },
          (error) => {
            console.error('Error conectando WebSocket:', error);
            this.isConnected = false;
            this.notifyConnectionHandlers(false);
            
            // Intentar reconectar
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              this.reconnectAttempts++;
              console.log(`Reintentando conexión... Intento ${this.reconnectAttempts}`);
              setTimeout(() => this.connect(), 3000);
            } else {
              reject(error);
            }
          }
        );
      } catch (error) {
        console.error('Error creando conexión WebSocket:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.stompClient && this.isConnected) {
      this.stompClient.disconnect(() => {
        console.log('Desconectado de WebSocket');
        this.isConnected = false;
        this.notifyConnectionHandlers(false);
      });
    }
  }

  addMessageHandler(handler) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler) {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  addConnectionHandler(handler) {
    this.connectionHandlers.push(handler);
  }

  removeConnectionHandler(handler) {
    const index = this.connectionHandlers.indexOf(handler);
    if (index > -1) {
      this.connectionHandlers.splice(index, 1);
    }
  }

  notifyMessageHandlers(message) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error en message handler:', error);
      }
    });
  }

  notifyConnectionHandlers(isConnected) {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(isConnected);
      } catch (error) {
        console.error('Error en connection handler:', error);
      }
    });
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Crear instancia singleton
const webSocketService = new WebSocketService();

export default webSocketService;