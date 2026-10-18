const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Color name is required'],
    trim: true,
  },
  hex: {
    type: String,
    required: [true, 'HEX value is required'],
    trim: true,
    match: [/^#([0-9A-Fa-f]{6})$/, 'HEX must be in #RRGGBB format'],
  },
  rgb: {
    r: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    g: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    b: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  finish: {
    type: String,
    enum: {
      values: ['matte', 'satin', 'semi-gloss', 'gloss', 'eggshell'],
      message: 'Finish must be matte, satin, semi-gloss, gloss, or eggshell',
    },
    required: [true, 'Finish type is required'],
  },
  category: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    trim: true,
    default: '',
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

// Indexes for fast filtering
colorSchema.index({ category: 1 });
colorSchema.index({ brand: 1 });
colorSchema.index({ name: 'text' });

const Color = mongoose.model('Color', colorSchema);

module.exports = Color;
