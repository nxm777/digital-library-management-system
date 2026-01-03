const mongoose = require('mongoose');

const readingSessionSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book reference is required']
  },
  pagesRead: {
    type: Number,
    required: [true, 'Number of pages read is required'],
    min: [1, 'You must read at least one page']
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Duration of session is required'],
    min: [1, 'Session duration must be at least 1 minute']
  },
  sessionDate: {
    type: Date,
    required: [true, 'Session date is required'],
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
});

readingSessionSchema.index({ ownerId: 1, sessionDate: -1 });

module.exports = mongoose.model('ReadingSession', readingSessionSchema);