import mongoose from 'mongoose'

const shapeSchema = new mongoose.Schema({
  shapeId:     { type: String, required: true, unique: true },
  boardId:     { type: String, required: true },
  type:        { type: String, enum: ['rect', 'circle', 'line', 'pencil', 'text'], required: true },
  x:           { type: Number },
  y:           { type: Number },
  width:       { type: Number },
  height:      { type: Number },
  points:      [{ x: Number, y: Number }],
  strokeColor: { type: String, default: '#06b6d4' },
  fillColor:   { type: String, default: 'transparent' },
  strokeWidth: { type: Number, default: 2 },
  text:        { type: String },
  zIndex:      { type: Number, default: 0 },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
  isDeleted:   { type: Boolean, default: false }
})

shapeSchema.index({ boardId: 1, isDeleted: 1, zIndex: 1 })

shapeSchema.statics.findActiveByBoard = function(boardId) {
  return this.find({ boardId, isDeleted: false }).sort({ zIndex: 1 })
}

export default mongoose.model('Shape', shapeSchema)