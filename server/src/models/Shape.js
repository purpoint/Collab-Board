import mongoose from 'mongoose';

const shapeSchema = new mongoose.Schema({
  shapeId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  boardId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['rect', 'circle', 'line', 'text'],
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  width: Number,
  height: Number,
  strokeColor: {
    type: String,
    default: '#ffffff',
  },
  fillColor: {
    type: String,
    default: 'transparent',
  },
  strokeWidth: {
    type: Number,
    default: 2,
  },
  text: String,
  zIndex: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

shapeSchema.index({ boardId: 1, isDeleted: 1, zIndex: 1 });

shapeSchema.statics.findActiveByBoard = function (boardId) {
  return this.find({ boardId, isDeleted: false }).sort({ zIndex: 1 });
};

const Shape = mongoose.model('Shape', shapeSchema);

export default Shape;
