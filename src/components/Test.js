import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function Test() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initializeSocket = () => {
      const mySocket = io('http://localhost:5001', {
        transports: ['websocket'],
        cors: {
          origin: 'http://localhost:3000',
        },
      });

      mySocket.on('connect', () => {
        console.log('Connected to the WebSocket server');
      });

      mySocket.on('data', (data) => {
        console.log('Received data from the server:', data);
        // Handle the received data as needed
      });

      mySocket.on('disconnect', () => {
        console.log('Disconnected from the WebSocket server');
      });

      setSocket(mySocket);
    };

    initializeSocket();
  }, []);

  const handleClick = () => {
    // Assuming my_editor is your code editor reference
    socket.emit('data', 'pleasework');
  };

  return (
    <div>
      <h1>WebSocket Client</h1>
      <button onClick={handleClick}>Send Data</button>
    </div>
  );
};

