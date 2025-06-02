import React, { useState, useEffect, useRef } from 'react';
import { Activity, Send, Trash2, Circle, Clock, MessageSquare, Server, Partition, Hash } from 'lucide-react';

const KafkaMessagesDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const stompRef = useRef(null);
  const socketRef = useRef(null);

  // Configuración de colores para tópicos
  const topicColors = {
    topico1: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600' },
    topico2: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-600' },
    topico3: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-600' }
  };

  // Conectar a WebSocket
  useEffect(() => {
    connectWebSocket();
    return () => disconnectWebSocket();
  }, []);

  const connectWebSocket = () => {
    try {
      setConnectionStatus('Connecting...');
      
      // Simulación de conexión WebSocket (en producción usar SockJS/STOMP)
      setTimeout(() => {
        setIsConnected(true);
        setConnectionStatus('Connected');
        
        // Simular algunos mensajes iniciales
        const initialMessages = [
          {
            content: "Mensaje inicial para topico1",
            topic: "topico1",
            partition: 0,
            offset: 1,
            consumerGroup: "consumer-topico1-partition0",
            timestamp: new Date().toISOString()
          },
          {
            content: "Otro mensaje para topico2",
            topic: "topico2", 
            partition: 1,
            offset: 2,
            consumerGroup: "consumer-topico2-partition1",
            timestamp: new Date().toISOString()
          }
        ];
        setMessages(initialMessages);
      }, 1000);
      
    } catch (error) {
      console.error('Error conectando WebSocket:', error);
      setConnectionStatus('Connection Failed');
    }
  };

  const disconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    setIsConnected(false);
    setConnectionStatus('Disconnected');
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('http://localhost:8080/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (response.ok) {
        // Simular recepción del mensaje
        const simulatedMessage = {
          content: newMessage,
          topic: determineTopicFromMessage(newMessage),
          partition: Math.floor(Math.random() * 2),
          offset: Date.now(),
          consumerGroup: `consumer-${determineTopicFromMessage(newMessage)}-partition${Math.floor(Math.random() * 2)}`,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [simulatedMessage, ...prev]);
        setNewMessage('');
      } else {
        console.error('Error enviando mensaje');
      }
    } catch (error) {
      console.error('Error:', error);
      // Simular mensaje local si hay error de conexión
      const simulatedMessage = {
        content: newMessage,
        topic: determineTopicFromMessage(newMessage),
        partition: Math.floor(Math.random() * 2),
        offset: Date.now(),
        consumerGroup: `consumer-${determineTopicFromMessage(newMessage)}-partition${Math.floor(Math.random() * 2)}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [simulatedMessage, ...prev]);
      setNewMessage('');
    }
  };

  const determineTopicFromMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('topico1')) return 'topico1';
    if (lowerMessage.includes('topico2')) return 'topico2';
    if (lowerMessage.includes('topico3')) return 'topico3';
    return 'topico1'; // default
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getTopicStats = () => {
    const stats = {};
    messages.forEach(msg => {
      if (!stats[msg.topic]) {
        stats[msg.topic] = { total: 0, partition0: 0, partition1: 0 };
      }
      stats[msg.topic].total++;
      stats[msg.topic][`partition${msg.partition}`]++;
    });
    return stats;
  };

  const topicStats = getTopicStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Kafka Messages Dashboard
                </h1>
                <p className="text-gray-400 text-sm">Sistema de mensajería en tiempo real</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Circle className={`w-3 h-3 ${isConnected ? 'text-green-400 fill-current' : 'text-red-400 fill-current'}`} />
                <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {connectionStatus}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Total: {messages.length} mensajes
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Sección de envío de mensajes */}
        <div className="mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Send className="w-5 h-5 mr-2 text-blue-400" />
              Enviar Mensaje
            </h2>
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu mensaje (incluye 'topico1', 'topico2' o 'topico3')..."
                className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </div>
            
            {/* Ejemplos */}
            <div className="mt-4 text-sm text-gray-400">
              <span className="font-medium">Ejemplos:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "Hola desde topico1",
                  "Mensaje para topico2",
                  "Datos importantes topico3"
                ].map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setNewMessage(example)}
                    className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors duration-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas por tópico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(topicStats).map(([topic, stats]) => (
            <div key={topic} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${topicColors[topic]?.bg || 'bg-gray-500'} rounded-lg`}>
                    <Server className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">{topic}</h3>
                    <p className="text-sm text-gray-400">Total: {stats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Partición 0</span>
                  <span className="font-medium">{stats.partition0 || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Partición 1</span>
                  <span className="font-medium">{stats.partition1 || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lista de mensajes */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50">
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-400" />
                Mensajes Recibidos ({messages.length})
              </h2>
              <button
                onClick={clearMessages}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpiar</span>
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay mensajes recibidos</p>
                <p className="text-sm mt-2">Envía un mensaje para comenzar</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-l-4 ${topicColors[message.topic]?.border || 'border-gray-500'} bg-gray-700/30 hover:bg-gray-700/50 transition-colors duration-200`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${topicColors[message.topic]?.bg || 'bg-gray-500'} text-white`}>
                            {message.topic}
                          </span>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Partition className="w-3 h-3" />
                            <span className="text-xs">Partición {message.partition}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Hash className="w-3 h-3" />
                            <span className="text-xs">Offset {message.offset}</span>
                          </div>
                        </div>
                        
                        <p className="text-white font-medium mb-2">{message.content}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>Consumer: {message.consumerGroup}</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(message.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KafkaMessagesDashboard;