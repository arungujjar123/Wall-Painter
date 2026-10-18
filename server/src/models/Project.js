const mongoose = require('mongoose');

const wallSelectionSchema = new mongoose.Schema(
  {
    points: [
      {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      },
    ],
    colorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
    },
    patternId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pattern',
    },
    opacity: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 1,
    },
    finish: {
      type: String,
      enum: ['matte', 'satin', 'semi-gloss', 'gloss', 'eggshell'],
      default: 'matte',
    },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters'],
  },
  originalImage: {
    type: String,
    required: [true, 'Original image is required'],
  },
  wallSelections: [wallSelectionSchema],
  paintedImage: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
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
});

// Update the updatedAt timestamp before every save
projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

projectSchema.index({ isPublic: 1, createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
