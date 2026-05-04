import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  boardId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['owner', 'editor', 'viewer'],
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastActivityAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

boardSchema.statics.findByBoardId = function (boardId) {
  return this.findOne({ boardId }).populate('ownerId', 'username avatarColor');
};

const Board = mongoose.model('Board', boardSchema);

export default Board;
