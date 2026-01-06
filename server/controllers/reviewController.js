const Review = require('../models/Review');
const Book = require('../models/Book');
const { handleInvalidObjectId } = require('../utils/handleErrors');

exports.addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.user.id;

    const bookExists = await Book.exists({_id: bookId});
    if (!bookExists) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

	const review = new Review({
		bookId, userId, rating, comment
	});

	const savedReview = await review.save();

    const populatedReview = await Review.findById(savedReview._id)
      .populate('bookId', 'title')
      .populate('userId', 'username');

	res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: populatedReview
    });
    

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }

    return res.status(500).json({ success: false, message: 'Server error while adding review' });
  }
};

exports.deleteReview = async (req, res) => {
	try {
		const { reviewId } = req.params;

		const review = await Review.findById(reviewId);

		if (!review) {
			return res.status(404).json({ 
				success: false, 
				message: 'Review not found' 
			});
		}

		const isAuthor = review.userId.toString() === req.user.id;
    
    	const isAdmin = req.user.role === 'admin';

		if (!isAuthor && !isAdmin) {
      		return res.status(403).json({ 
        		success: false, 
        		message: 'Not authorized to delete this review' 
      		});
    	}

		await review.deleteOne();

		return res.status(200).json({ 
      		success: true, 
      		message: 'Review deleted successfully' 
    	});

	} catch (err) {
		const invalidId = handleInvalidObjectId(err, res);
		if (invalidId) return invalidId;
		console.error('Error deleting review:', err);
		return res.status(500).json({ 
			success: false, 
			message: 'Server error while deleting review' 
		});
	}
};

exports.getAllReviews = async (req, res) => {
	try {
		const { search = '', page = 1, limit = 0 } = req.query;

		const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
		const limitNumber = Math.max(parseInt(limit, 10) || 0, 0);

		const searchRegex = search ? new RegExp(search, 'i') : null;
		const bookIds = searchRegex
			? (await Book.find({ title: { $regex: searchRegex } }).select('_id')).map((b) => b._id)
			: [];

		const query = searchRegex
			? {
					$or: [
						{ comment: { $regex: searchRegex } },
						{ bookId: { $in: bookIds } },
					],
				}
			: {};

		const totalCount = limitNumber
			? await Review.countDocuments(query)
			: null;

		const reviewsQuery = Review.find(query)
			.sort({ createdAt: -1 })
			.populate({
				path: 'bookId',
				select: 'title author rating imageUrl coverImage',
				populate: {
					path: 'author',
					select: 'first_name last_name',
				},
			})
			.populate({
				path: 'userId',
				select: 'username email role',
			});

		if (limitNumber) {
			reviewsQuery.skip((pageNumber - 1) * limitNumber).limit(limitNumber);
		}

		const reviews = await reviewsQuery;
		const resolvedTotal = totalCount ?? reviews.length;
		const totalPages = limitNumber ? Math.max(Math.ceil(resolvedTotal / limitNumber), 1) : 1;

		return res.status(200).json({
			success: true,
			count: resolvedTotal,
			totalPages,
			currentPage: pageNumber,
			data: reviews,
		});
	} catch (error) {
		console.error('Error fetching reviews:', error);
		return res.status(500).json({ success: false, message: 'Server Error' });
	}
};

exports.getReview = async (req, res) => {
	try {
		const { reviewId } = req.params;
		const review = await Review.findById(reviewId)
			.populate('bookId', 'title')
			.populate('userId', 'username');

		if (!review) {
			return res.status(404).json({
				success: false, 
				message: 'Review not found' 
			});
		}

		return res.status(200).json({ 
			success: true, 
			data: review 
		});

	} catch (err) {
		const invalidId = handleInvalidObjectId(err, res);
        if (invalidId) return invalidId;
		console.error('Error fetching review:', err);
		return res.status(500).json({ success: false, message: 'Server error while fetching review' });
	}
};

exports.getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { search } = req.query;

        let query = { userId: userId };

        if (search) {
            const books = await Book.find({ 
                title: { $regex: search, $options: 'i' } 
            }).select('_id');
            
            const bookIds = books.map(b => b._id);
            query.bookId = { $in: bookIds };
        }

        const reviews = await Review.find(query)
            .populate({
                path: 'bookId',
                select: 'title author rating imageUrl', 
                populate: { path: 'author', select: 'first_name last_name' }
            })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });

        return res.status(200).json({ 
            success: true, 
            count: reviews.length, 
            data: reviews 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateReview = async (req, res) => {
	try {
		const { reviewId } = req.params;
		const { rating, comment } = req.body;

		const review = await Review.findById(reviewId);
		if (!review) {
			return res.status(404).json({ 
				success: false,
				message: 'Review not found' });
		}

		if (review.userId.toString() !== req.user.id) {
      		return res.status(403).json({ 
        		success: false, 
        		message: 'Not authorized to update this review' 
      		});
    	}

		if (rating) review.rating = rating;


		if (comment !== undefined) review.comment = comment;

		const savedReview = await review.save();

		await savedReview.populate('bookId', 'title');
 		await savedReview.populate('userId', 'username avatar');

    	return res.status(200).json({
      		success: true,
      		message: 'Review updated successfully',
      		data: savedReview
    	});

	} catch (err) {
		const invalidId = handleInvalidObjectId(err, res);
    	if (invalidId) return invalidId;
		console.error('Error updating review:', err);
		return res.status(500).json({ success: false, message: 'Server error while updating review' });
	}
};