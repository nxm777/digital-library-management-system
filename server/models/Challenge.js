const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Challenge title is required'],
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    enum: ['PAGES', 'TIME'],
    required: true
  },
  targetValue: {
    type: Number,
    required: true,
    min: [1, 'Target value must be positive']
  },
  currentProgress: {
    type: Number,
    default: 0,
    min: 0
  },
  startDate: {
    type: Date,
    required: true,
    default: () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    }
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'COMPLETED', 'FAILED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true,
  versionKey: false
});

challengeSchema.virtual('percentCompleted').get(function() {
  if (this.targetValue === 0) return 0;
  const percent = Math.round((this.currentProgress / this.targetValue) * 100);
  return Math.min(100, percent);
});

challengeSchema.set('toJSON', { virtuals: true });
challengeSchema.set('toObject', { virtuals: true });

challengeSchema.statics.updateProgress = async function(userId, session) {
  try {
    const { pagesRead, durationMinutes, sessionDate } = session;
    const sessDateObj = new Date(sessionDate);

    const activeChallenges = await this.find({
      ownerId: userId,
      status: 'ACTIVE',
      startDate: { $lte: sessDateObj }, 
      endDate: { $gte: sessDateObj }    
    });

    if (activeChallenges.length === 0) return;

    const updatePromises = activeChallenges.map(async (challenge) => {
      let progressToAdd = 0;

      if (challenge.type === 'PAGES') {
        progressToAdd = Number(pagesRead) || 0;
      } else if (challenge.type === 'TIME') {
        progressToAdd = Number(durationMinutes) || 0;
      }

      const newProgress = challenge.currentProgress + progressToAdd;
      challenge.currentProgress = Math.min(newProgress, challenge.targetValue);

      if (challenge.currentProgress >= challenge.targetValue) {
        challenge.status = 'COMPLETED';
      }

      return challenge.save();
    });

    await Promise.all(updatePromises);
    
  } catch (error) {
    console.error('Error in Challenge.updateProgress:', error);
  }
};

module.exports = mongoose.model('Challenge', challengeSchema);