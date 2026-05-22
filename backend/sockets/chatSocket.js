import ChatMessage from '../models/ChatMessage.js';

const setupSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-session', (sessionId) => {
      socket.join(`chat-${sessionId}`);
      socket.sessionId = sessionId;
    });

    socket.on('send-message', async (data) => {
      try {
        const { session_id, sender, message } = data;

        const msg = new ChatMessage({
          session_id,
          sender: sender || 'customer',
          message,
        });

        await msg.save();

        io.to(`chat-${session_id}`).emit('new-message', msg);
      } catch (error) {
        console.error('Socket error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupSockets;
