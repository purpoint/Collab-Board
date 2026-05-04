import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  passwordHash: String,
  avatarColor: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastSeenAt: Date,
});

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

userSchema.pre('save', function (next) {
  if (!this.avatarColor) {
    const randomIndex = Math.floor(Math.random() * AVATAR_COLORS.length);
    this.avatarColor = AVATAR_COLORS[randomIndex];
  }
  next();
});

userSchema.methods.toSafeObject = function () {
  const userObj = this.toObject();
  delete userObj.passwordHash;
  return userObj;
};

const User = mongoose.model('User', userSchema);

export default User;
