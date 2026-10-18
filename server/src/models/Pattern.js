const mongoose = require('mongoose');

const patternSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pattern name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: ['Floral', 'Geometric', 'Abstract', 'Stripes', 'Textured', 'Damask', 'Chevron', 'Polka Dot', 'Brick', 'Wood Grain'],
      message: 'Invalid pattern category',
    },
  },
  imageUrl: {
    type: String,
    required: [true, 'Pattern image URL is required'],
  },
  style: {
    type: String,
    trim: true,
    default: '',
  },
  scale: {
    type: Number,
    default: 1,
    min: [0.1, 'Scale cannot be less than 0.1'],
    max: [10, 'Scale cannot exceed 10'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

patternSchema.index({ category: 1 });

const Pattern = mongoose.model('Pattern', patternSchema);

module.exports = Pattern;
