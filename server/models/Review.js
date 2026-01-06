const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book reference is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  { versionKey: false, timestamps: true }
);

reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (bookId) {

  const stats = await this.aggregate([
    { 
      $match: { 

        bookId: new mongoose.Types.ObjectId(bookId) 
      } 
    },
    {
      $group: {
        _id: '$bookId',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Book').findByIdAndUpdate(bookId, {
        'rating.average': Math.round(stats[0].avgRating * 10) / 10,
        'rating.count': stats[0].count,
      });
    } else {
      await mongoose.model('Book').findByIdAndUpdate(bookId, {
        'rating.average': 0,
        'rating.count': 0,
      });
    }
  } catch (error) {
    console.error('Error updating book rating stats:', error);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.bookId);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  await this.constructor.calculateAverageRating(this.bookId);
});

module.exports = mongoose.model('Review', reviewSchema);
