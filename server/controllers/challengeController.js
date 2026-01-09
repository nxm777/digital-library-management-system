const Challenge = require('../models/Challenge');

exports.createChallenge = async (req, res) => {
  try {
    const { title, type, targetValue, endDate } = req.body;

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); 
    
    if (end < new Date()) {
       return res.status(400).json({
         success: false,
         message: 'End date must be in the future'
       });
    }

    const newChallenge = await Challenge.create({
      ownerId: req.user.id,
      title,
      type,       
      targetValue, 
      endDate: end
    });

    return res.status(201).json({
      success: true,
      data: newChallenge
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getUserChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ ownerId: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: challenges.length,
      data: challenges
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    const challenge = await Challenge.findOne({ 
      _id: challengeId, 
      ownerId: req.user.id 
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found or unauthorized'
      });
    }

    await challenge.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Challenge deleted successfully'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};