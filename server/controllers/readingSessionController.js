const ReadingSession = require('../models/ReadingSession');
const Book = require('../models/Book');
const Challenge = require('../models/Challenge');
const { handleInvalidObjectId } = require('../utils/handleErrors');
const { isOwner } = require('../utils/permissions');

exports.createReadingSession = async (req, res) => {
  try {
    const { book, pagesRead, durationMinutes, sessionDate, notes } = req.body;

    const bookExists = await Book.exists({ _id: book });
    
    if (!bookExists) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const newSession = await ReadingSession.create({
      ownerId: req.user.id,
      book: book,
      pagesRead,
      durationMinutes,
      sessionDate: sessionDate || Date.now(),
      notes
    });

    await Challenge.updateProgress(req.user.id, newSession);

    return res.status(201).json({
      success: true,
      message: 'Reading session added successfully',
      data: newSession
    });

  } catch (error) {
    console.error('Error creating reading session:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating reading session'
    });
  }
};

exports.deleteReadingSession = async (req, res) => {
  try {
    const { readingSessionId } = req.params;
    
    const readingSession = await ReadingSession.findById(readingSessionId);

    if (!readingSession) {
      return res.status(404).json({
        success: false,
        message: 'Reading session not found'
      });
    }

    if (!isOwner(readingSession, req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this session'
      });
    }

    await readingSession.deleteOne();
    return res.status(200).json({
      success: true,
      message: 'Reading session deleted successfully'
    });

  } catch (error) {
    const invalidId = handleInvalidObjectId(error, res);
    if (invalidId) return invalidId;
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while deleting the reading session',
    });
  }
};

exports.getReadingSession = async (req, res) => {
  try {
    const { readingSessionId } = req.params;
    const readingSession = await ReadingSession.findById(readingSessionId)
      .populate('book', 'title author');

    if (!readingSession) {
      return res.status(404).json({
        success: false,
        message: 'Reading session not found'
      });
    }

    if (!isOwner(readingSession, req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this session'
      });
    }

    return res.status(200).json({
      success: true,
      data: readingSession,
    });
  } catch (error) {
    const invalidId = handleInvalidObjectId(error, res);
    if (invalidId) return invalidId;
    console.error('Error fetching reading session:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching reading session',
    });
  }
};

exports.getUserReadingSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const { startDate, endDate } = req.query;
    let query = { ownerId: userId };

    if (startDate || endDate) {
      query.sessionDate = {};

      if (startDate) {
        query.sessionDate.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        query.sessionDate.$lte = end;
      }
    }

    const sessions = await ReadingSession.find(query)

      .sort({ sessionDate: -1 }) 

      .populate('book', 'title author'); 

    return res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    console.error('Error fetching user reading sessions:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching user reading sessions',
    });
  }
};

exports.updateReadingSession = async (req, res) => {
  try {
    const { readingSessionId } = req.params;

    const { pagesRead, durationMinutes, sessionDate, notes } = req.body;

    const readingSession = await ReadingSession.findById(readingSessionId);
    if (!readingSession) {
      return res.status(404).json({
        success: false,
        message: 'Reading session not found'
      });
    }

    if (!isOwner(readingSession, req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this session'
      });
    }

    if (pagesRead !== undefined) readingSession.pagesRead = pagesRead;
    if (durationMinutes !== undefined) readingSession.durationMinutes = durationMinutes;
    if (sessionDate !== undefined) readingSession.sessionDate = sessionDate;
    
    if (notes !== undefined) readingSession.notes = notes;

    await readingSession.save();
    await readingSession.populate('book', 'title author');


    return res.status(200).json({
      success: true,
      message: 'Reading session updated successfully',
      data: readingSession
    });

  } catch (error) {
    const invalidId = handleInvalidObjectId(error, res);
    if (invalidId) return invalidId;
    console.error('Error updating reading session:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating reading session',
    });
  }
};