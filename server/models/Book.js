const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [2, "Title must be at least 2 characters"],
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  author: {
    first_name: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [30, "First name cannot exceed 30 characters"]
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [60, "Last name cannot exceed 60 characters"]
    }
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required'],
    trim: true,
    minlength: [2, "Publisher must be at least 2 characters"],
    maxlength: [60, "Publisher cannot exceed 60 characters"]
  },
  genres: {
    type: [String],
    default: [],
    set: (genres) => genres.map(g => g.toLowerCase())
  },
  numOfPages: {
    type: Number,
    required: [true, 'Number of pages is required'],
    min: [1, 'Number of pages must be at least 1']
  },
  publicationYear: {
    type: Number,
    required: [true, 'Publication year is required']
  },
  imageUrl: {
    type: String,
    default: '',
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }

}, {timestamps: true, versionKey: false});

bookSchema.index({ genres: 1 });

module.exports = mongoose.model('Book', bookSchema);