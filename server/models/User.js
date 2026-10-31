const mongoose = require('mongoose');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'civicpulse-production-super-secret-key-2026';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    role: {
      type: String,
      enum: ['citizen', 'admin'],
      default: 'citizen'
    },
    department: {
      type: String,
      default: 'Community Resident'
    },
    passwordHash: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Method to set hashed password with salt
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

// Method to verify password
userSchema.methods.verifyPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
  return this.passwordHash === hash;
};

// Method to generate standard HMAC-SHA256 signed token
userSchema.methods.generateToken = function () {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      id: this._id,
      email: this.email,
      role: this.role,
      name: this.name,
      department: this.department,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
};

// Static helper to verify token
userSchema.statics.verifyToken = function (token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (signature !== expectedSig) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null; // expired
    return data;
  } catch (e) {
    return null;
  }
};

// Helper to return clean user profile
userSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    department: this.department,
    createdAt: this.createdAt,
    token: this.generateToken()
  };
};

module.exports = mongoose.model('User', userSchema);
