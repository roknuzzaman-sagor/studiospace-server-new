const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken, setAuthCookie, clearAuthCookie } = require('../utils/jwt');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---------------- REGISTER ----------------
exports.register = async (req, res) => {
  try {
    const { name, email, photoURL, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!pwdRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must contain uppercase, lowercase and be at least 6 characters',
      });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      photoURL: photoURL || '',
      provider: 'local',
    });

    res.status(201).json({
      message: 'Registered successfully',
      user: { id: user._id, name: user.name, email: user.email, photoURL: user.photoURL },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    setAuthCookie(res, token);

    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, photoURL: user.photoURL },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GOOGLE LOGIN ----------------
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Credential required' });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        photoURL: picture || '',
        provider: 'google',
      });
    }

    const token = signToken(user);
    setAuthCookie(res, token);

    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, photoURL: user.photoURL },
    });
  } catch {
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

// ---------------- ME ----------------
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- LOGOUT ----------------
exports.logout = (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out' });
};