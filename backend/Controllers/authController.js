import bcrypt from 'bcryptjs';
import User from '../Models/User.js';
import { generateToken } from '../Middlewares/verifyJWT.js';

async function register(req, res) {
  try {
    const { nom, email, telephone, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nom,
      email,
      telephone,
      password: hashedPassword,
      role,
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({ user: { id: user.id, nom: user.nom, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({ user: { id: user.id, nom: user.nom, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
}

async function profile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
  }
}

export { register, login, profile };