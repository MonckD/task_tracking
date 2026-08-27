import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { sequelize, connectToDatabase } from './Config/config.js';
import authRoutes from './Routes/auth.js';
import teamRoutes from './Routes/team.js';
import projectRoutes from './Routes/project.js';
import taskRoutes from './Routes/task.js';
import chatRoutes from './Routes/chat.js';
import notificationRoutes from './Routes/notification.js';
import webhookRoutes from './Routes/webhook.js';
import { initSocket } from './Config/socket.js';
import './Models/User.js';
import './Models/Team.js';
import './Models/TeamMember.js';
import './Models/Project.js';
import './Models/Task.js';
import './Models/TaskUpdate.js';
import './Models/Message.js';
import './Models/Notification.js';

dotenv.config();

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(authRoutes);
app.use(teamRoutes);
app.use(projectRoutes);
app.use(taskRoutes);
app.use(chatRoutes);
app.use(notificationRoutes);
app.use(webhookRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const connected = async () => {
  try {
    await connectToDatabase();
    await sequelize.sync({ alter: true });
    console.log('Tables synchronisées');
    initSocket(server);
    server.listen(port, () => {
      console.log(`Serveur démarré sur le port ${port}`);
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
  }
};

connected();