const mongoose = require('mongoose');
const ReadingSession = require('../models/ReadingSession');

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let matchStage = { ownerId: new mongoose.Types.ObjectId(userId) };

    if (startDate || endDate) {
        matchStage.sessionDate = {};
        if (startDate) matchStage.sessionDate.$gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            matchStage.sessionDate.$lte = end;
        }
    }

    const timelineQuery = ReadingSession.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$sessionDate" } },
          totalPages: { $sum: "$pagesRead" },
          totalMinutes: { $sum: "$durationMinutes" },
          sessionCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: { date: "$_id", totalPages: 1, totalMinutes: 1, sessionCount: 1, _id: 0 }
      }
    ]);

    const genreQuery = ReadingSession.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: 'books',
                localField: 'book',
                foreignField: '_id',
                as: 'bookData'
            }
        },
        { $unwind: { path: '$bookData', preserveNullAndEmptyArrays: false } },
        { $unwind: '$bookData.genres' },
        {
            $group: {
                _id: '$bookData.genres',
                books: { $addToSet: '$bookData._id' },
            }
        },
        {
            $project: {
                _id: 1,
                count: { $size: '$books' }
            }
        },
        { $sort: { count: -1 } }
    ]);

    const booksReadQuery = ReadingSession.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$book",
                periodPages: { $sum: "$pagesRead" },
                periodMinutes: { $sum: "$durationMinutes" },
                lastSessionDate: { $max: "$sessionDate" },
                sessionsCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "books",
                localField: "_id",
                foreignField: "_id",
                as: "bookDetails"
            }
        },
        { $unwind: { path: "$bookDetails", preserveNullAndEmptyArrays: false } },
        {
            $project: {
                _id: 1,
                title: "$bookDetails.title",
                author: "$bookDetails.author",
                periodPages: 1,
                periodMinutes: 1,
                lastSessionDate: 1,
                sessionsCount: 1
            }
        },
        { $sort: { lastSessionDate: -1 } }
    ]);

    const [timeline, genres, booksRead] = await Promise.all([
        timelineQuery,
        genreQuery,
        booksReadQuery
    ]);

    const summary = {
        totalPages: timeline.reduce((acc, curr) => acc + curr.totalPages, 0),
        totalMinutes: timeline.reduce((acc, curr) => acc + curr.totalMinutes, 0),
        totalSessions: timeline.reduce((acc, curr) => acc + curr.sessionCount, 0)
    };

    return res.status(200).json({
      success: true,
      data: {
        timeline,
        genres,
        booksRead,
        summary
      }
    });

  } catch (error) {
    console.error('Error in getUserStats:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};