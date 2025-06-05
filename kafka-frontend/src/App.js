import React, { useState } from 'react';

const KafkaMessagesDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await fetch('http://localhost:8080/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage }),
      });

      // Agregar mensaje a la lista
      const newMsg = {
        content: newMessage,
        topic: getTopic(newMessage),
        partition: Math.floor(Math.random() * 2),
        time: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [newMsg, ...prev]);
      setNewMessage('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getTopic = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('topico1')) return 'topico1';
    if (msg.includes('topico2')) return 'topico2';
    if (msg.includes('topico3')) return 'topico3';
    return 'topico1';
  };

  const getColor = (topic) => {
    if (topic === 'topico1') return '#3b82f6'; // azul
    if (topic === 'topico2') return '#10b981'; // verde
    if (topic === 'topico3') return '#8b5cf6'; // morado
    return '#6b7280'; // gris
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1f2937', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Título */}
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Sistema Kafka con Spring Boot y React
      </h1>

      {/* Formulario para enviar mensajes */}
      <div style={{ 
        backgroundColor: '#374151', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '30px' 
      }}>
        <h2>Enviar Mensaje:</h2>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe: topico1, topico2 o topico3"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#4b5563',
              color: 'white'
            }}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Lista de mensajes */}
      <div style={{ 
        backgroundColor: '#374151', 
        padding: '20px', 
        borderRadius: '10px' 
      }}>
        <h2>Mensajes Recibidos ({messages.length}):</h2>
        
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
            No hay mensajes. Envía uno para empezar
          </p>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  margin: '10px 0',
                  padding: '15px',
                  backgroundColor: '#4b5563',
                  borderRadius: '8px',
                  borderLeft: `5px solid ${getColor(msg.topic)}`
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <span 
                    style={{
                      backgroundColor: getColor(msg.topic),
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      marginRight: '10px'
                    }}
                  >
                    {msg.topic}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    Partición {msg.partition} • {msg.time}
                  </span>
                </div>
                <div style={{ fontSize: '16px' }}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div style={{ 
          backgroundColor: '#374151', 
          padding: '15px', 
          borderRadius: '10px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <h3>Estadísticas:</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
            {['topico1', 'topico2', 'topico3'].map(topic => {
              const count = messages.filter(m => m.topic === topic).length;
              return (
                <div key={topic} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    color: getColor(topic), 
                    fontSize: '24px', 
                    fontWeight: 'bold' 
                  }}>
                    {count}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {topic}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default KafkaMessagesDashboard;