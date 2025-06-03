import React, { useState, useEffect } from 'react';

const KafkaMessagesDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  // Configuración de colores para tópicos
  const topicColors = {
    topico1: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600' },
    topico2: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-600' },
    topico3: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-600' }
  };

  // Conectar a WebSocket
  useEffect(() => {
    connectWebSocket();
  }, []);

  const connectWebSocket = () => {
    try {
      setConnectionStatus('Connecting...');
      
      // Simulación de conexión WebSocket
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
        // Simular mensaje local si hay error
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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '1rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                🚀 Kafka Messages Dashboard
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                Sistema de mensajería en tiempo real
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: isConnected ? '#10b981' : '#ef4444',
                  display: 'inline-block'
                }}></span>
                <span style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '500',
                  color: isConnected ? '#10b981' : '#ef4444'
                }}>
                  {connectionStatus}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                Total: {messages.length} mensajes
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Sección de envío de mensajes */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: 'rgba(55, 65, 81, 0.5)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            border: '1px solid rgba(75, 85, 99, 0.5)',
            padding: '1.5rem'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              📨 Enviar Mensaje
            </h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu mensaje (incluye 'topico1', 'topico2' o 'topico3')..."
                style={{
                  flex: '1',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(75, 85, 99, 0.5)',
                  border: '1px solid #4b5563',
                  borderRadius: '0.75rem',
                  color: 'white',
                  fontSize: '1rem'
                }}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: newMessage.trim() 
                    ? 'linear-gradient(45deg, #3b82f6, #8b5cf6)' 
                    : '#6b7280',
                  border: 'none',
                  borderRadius: '0.75rem',
                  color: 'white',
                  fontWeight: '500',
                  cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                ➤ Enviar
              </button>
            </div>
            
            {/* Ejemplos */}
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#9ca3af' }}>
              <span style={{ fontWeight: '500' }}>Ejemplos:</span>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  "Hola desde topico1",
                  "Mensaje para topico2",
                  "Datos importantes topico3"
                ].map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setNewMessage(example)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'rgba(75, 85, 99, 0.5)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#d1d5db',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas por tópico */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {Object.entries(topicStats).map(([topic, stats]) => (
            <div key={topic} style={{
              backgroundColor: 'rgba(55, 65, 81, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  padding: '0.5rem',
                  backgroundColor: topicColors[topic]?.bg.replace('bg-', '') === 'blue-500' ? '#3b82f6' :
                                 topicColors[topic]?.bg.replace('bg-', '') === 'green-500' ? '#10b981' :
                                 topicColors[topic]?.bg.replace('bg-', '') === 'purple-500' ? '#8b5cf6' : '#6b7280',
                  borderRadius: '0.5rem',
                  marginRight: '0.75rem'
                }}>
                  🖥️
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', textTransform: 'capitalize', margin: 0 }}>{topic}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#9ca3af', margin: '0.25rem 0 0 0' }}>
                    Total: {stats.total}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Partición 0</span>
                  <span style={{ fontWeight: '500' }}>{stats.partition0 || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Partición 1</span>
                  <span style={{ fontWeight: '500' }}>{stats.partition1 || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lista de mensajes */}
        <div style={{
          backgroundColor: 'rgba(55, 65, 81, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          border: '1px solid rgba(75, 85, 99, 0.5)'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(75, 85, 99, 0.5)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600',
              margin: 0,
              display: 'flex',
              alignItems: 'center'
            }}>
              💬 Mensajes Recibidos ({messages.length})
            </h2>
            <button
              onClick={clearMessages}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#f87171',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🗑️ Limpiar
            </button>
          </div>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {messages.length === 0 ? (
              <div style={{ 
                padding: '3rem', 
                textAlign: 'center', 
                color: '#9ca3af' 
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: '0.5' }}>💬</div>
                <p>No hay mensajes recibidos</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Envía un mensaje para comenzar</p>
              </div>
            ) : (
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      borderLeft: `4px solid ${
                        topicColors[message.topic]?.bg.replace('bg-', '') === 'blue-500' ? '#3b82f6' :
                        topicColors[message.topic]?.bg.replace('bg-', '') === 'green-500' ? '#10b981' :
                        topicColors[message.topic]?.bg.replace('bg-', '') === 'purple-500' ? '#8b5cf6' : '#6b7280'
                      }`,
                      backgroundColor: 'rgba(75, 85, 99, 0.3)',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.5)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.3)'}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: topicColors[message.topic]?.bg.replace('bg-', '') === 'blue-500' ? '#3b82f6' :
                                         topicColors[message.topic]?.bg.replace('bg-', '') === 'green-500' ? '#10b981' :
                                         topicColors[message.topic]?.bg.replace('bg-', '') === 'purple-500' ? '#8b5cf6' : '#6b7280',
                          color: 'white'
                        }}>
                          {message.topic}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#9ca3af' }}>
                          <span style={{ fontSize: '0.75rem' }}>📦</span>
                          <span style={{ fontSize: '0.75rem' }}>Partición {message.partition}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#9ca3af' }}>
                          <span style={{ fontSize: '0.75rem' }}>#</span>
                          <span style={{ fontSize: '0.75rem' }}>Offset {message.offset}</span>
                        </div>
                      </div>
                      
                      <p style={{ 
                        color: 'white', 
                        fontWeight: '500', 
                        marginBottom: '0.5rem',
                        margin: '0.5rem 0'
                      }}>
                        {message.content}
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        fontSize: '0.75rem', 
                        color: '#9ca3af' 
                      }}>
                        <span>Consumer: {message.consumerGroup}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>🕒</span>
                          <span>{formatTimestamp(message.timestamp)}</span>
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