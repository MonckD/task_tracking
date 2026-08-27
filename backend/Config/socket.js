import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../Models/Message.js';

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentification requise'));
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Token invalide'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Utilisateur connecté: ${socket.user.id}`);

    socket.on('join_team', (teamId) => {
      socket.join(`team_${teamId}`);
      console.log(`Utilisateur ${socket.user.id} a rejoint la room team_${teamId}`);
    });

    socket.on('leave_team', (teamId) => {
      socket.leave(`team_${teamId}`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { teamId, contenu } = data;

        const message = await Message.create({
          contenu,
          sender_id: socket.user.id,
          team_id: teamId,
        });

        const fullMessage = await Message.findByPk(message.id, {
          include: [{ model: (await import('../Models/User.js')).default, as: 'sender', attributes: ['id', 'nom', 'email'] }],
        });

        io.to(`team_${teamId}`).emit('receive_message', fullMessage);
      } catch (error) {
        console.error('Erreur envoi message:', error.message);
        socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Utilisateur déconnecté: ${socket.user.id}`);
    });
  });

  return io;
}

function getIO() {
  return io;
}

export { initSocket, getIO };