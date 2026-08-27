import bcrypt from 'bcryptjs';
import User from '../Models/User.js';
import { sequelize, connectToDatabase } from './config.js';
import '../Models/User.js';

async function createAdmin() {
  try {
    await connectToDatabase();
    await sequelize.sync({ alter: true });

    const existing = await User.findOne({ where: { email: 'admin@trackingoda.com' } });
    if (existing) {
      console.log('Admin déjà existant');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await User.create({
      nom: 'Admin',
      email: 'admin@trackingoda.com',
      telephone: '0000000000',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin créé avec succès');
    process.exit();
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

createAdmin();