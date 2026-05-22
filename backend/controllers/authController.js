import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
    
    res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    const admin = new Admin({ email, password, name, role });
    await admin.save();
    
    res.status(201).json({ message: 'Admin created', admin: { email, name, role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.json({ message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;
    
    const admin = await Admin.findByIdAndUpdate(id, { name, role }, { new: true }).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
