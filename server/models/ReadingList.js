const mongoose = require('mongoose');

const readingListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [1, "Title must be at least 1 character"],
    maxlength: [50, "Title cannot exceed 50 characters"]
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, "Description cannot exceed 300 characters"],
    default: ""
  },
  books: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      }
    ],
    default: [],
    validate: {
      validator: function (arr) {
        return arr.length === new Set(arr.map(id => id.toString())).size;
      },
      message: 'Duplicate books are not allowed in the reading list'
    }
  },
  tags: {
    type: [String],
    default: [],
    set: tags => 
      [...new Set(tags.map(tag => tag.toLowerCase().trim()))].filter(Boolean)
  },
}, {versionKey: false, timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }});

readingListSchema.index({ ownerId: 1, title: 1 }, { unique: true });

readingListSchema.virtual('bookCount').get(function() {
  return this.books.length;
});

module.exports = mongoose.model('ReadingList', readingListSchema);