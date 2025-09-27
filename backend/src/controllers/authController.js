import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

export async function register(req, res) {
  try {
    const { name, email, password, gradeLevel, recoveryEmail, phone } = req.body;
    
    // Email validation
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return res.status(400).json({ message: 'Email must be a valid Gmail address (@gmail.com)' });
    }
    
    // Password validation
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
    }
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, gradeLevel, recoveryEmail, phone });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json({ user });
}

export async function updateMe(req, res) {
  try {
    const allowed = ['name', 'gradeLevel', 'interests', 'location', 'recoveryEmail', 'phone'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select('-passwordHash');
    res.json({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Update failed' });
  }
}

// Forgot Password - Send reset link or OTP
export async function forgotPassword(req, res) {
  try {
    const { email, phone, method } = req.body;
    
    let user;
    if (method === 'email' && email) {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found with this email' });
      }
      
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      
      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();
      
      // In a real app, you would send an email here
      console.log(`Password reset link: ${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`);
      
      res.json({ message: 'Password reset link sent to your email' });
      
    } else if (method === 'phone' && phone) {
      user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ message: 'User not found with this phone number' });
      }
      
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
      
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
      
      // In a real app, you would send SMS here
      console.log(`OTP for ${phone}: ${otp}`);
      
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetToken = resetToken;
      await user.save();
      
      res.json({ message: 'OTP sent to your phone number', resetToken });
      
    } else {
      return res.status(400).json({ message: 'Invalid method or missing email/phone' });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Failed to process forgot password request' });
  }
}

// Verify OTP
export async function verifyOtp(req, res) {
  try {
    const { otp, resetToken } = req.body;
    
    const user = await User.findOne({ 
      resetToken, 
      otp, 
      otpExpiry: { $gt: Date.now() } 
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    res.json({ message: 'OTP verified successfully', resetToken });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
}

// Reset Password
export async function resetPassword(req, res) {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    const user = await User.findOne({ 
      resetToken, 
      resetTokenExpiry: { $gt: Date.now() } 
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset token
    user.passwordHash = passwordHash;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
}


