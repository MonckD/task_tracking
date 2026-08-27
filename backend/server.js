import dotenv from 'dotenv';
import express from 'express';
import { sequelize, connectToDatabase } from './Config/config.js';
import authRoutes from './Routes/auth.js';
import teamRoutes from './Routes/team.js';
import projectRoutes from './Routes/project.js';
import taskRoutes from './Routes/task.js';
import './Models/User.js';
import './Models/Team.js';
import './Models/TeamMember.js';
import './Models/Project.js';
import './Models/Task.js';
import './Models/TaskUpdate.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(authRoutes);
app.use(teamRoutes);
app.use(projectRoutes);
app.use(taskRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const connected = async () => {
  try {
    await connectToDatabase();
    await sequelize.sync({ alter: true });
    console.log('Tables synchronisées');
    app.listen(port, () => {
      console.log(`Serveur démarré sur le port ${port}`);
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
  }
};

connected();