const ReadingList = require('../models/ReadingList');
const Book = require('../models/Book');
const { handleInvalidObjectId } = require('../utils/handleErrors');
const { isOwner } = require('../utils/permissions');


exports.createReadingList = async (req, res) => {
  
  const { title, description, tags } = req.body;
  
  const readingList = new ReadingList({
    title,
    description,
    tags: tags || [],
    ownerId: req.user.id
  });

  try {
    const saved = await readingList.save();
    res.status(201).json({ 
      message: 'Created reading list', 
      readingList: saved
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'You already have a list with the same name' 
      });
    }
    console.error('Create reading list error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getReadingList = async (req, res) => {
  const { readingListId } = req.params;
  const userId = req.user.id;

  try {
    const list = await ReadingList.findById(readingListId)
      .populate('books', 'title author imageUrl coverImage genres')
      .populate('ownerId', 'username');

    if (!list) {
      return res.status(404).json({ message: 'Reading list not found' });
    }

    if (!isOwner(list, userId)) {
      return res.status(403).json({ message: 'You have no access to this reading list' });
    }

    res.status(200).json({ readingList: list });
  } catch (error) {
    const invalidId = handleInvalidObjectId(error, res);
    if (invalidId) return invalidId;
    res.status(500).json({ message: 'Server error.', error });
  }
};

exports.deleteReadingList = async (req, res) => {
  try {
    const { readingListId } = req.params;
    const userId = req.user.id;

    const list = await ReadingList.findById(readingListId);

    if (!list) {
      return res.status(404).json({ 
        message: 'Reading list not found' 
      });
    }

    if (!isOwner(list, userId)) {
      return res.status(403).json({ 
        message: 'You are not allowed to delete this reading list'
      });
    }

    await list.deleteOne();

    res.status(200).json({ 
      message: 'Reading list deleted'
    });

  } catch (error) {
    const invalidId = handleInvalidObjectId(error, res);
    if (invalidId) return invalidId;
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getAllReadingLists = async (req, res) => {
  try {
    const lists = await ReadingList.find({ ownerId: req.user.id })
      .populate('books', 'title author')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: lists.length,
      data: lists
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateReadingList = async (req, res) => {
  try {
    const { readingListId } = req.params;
    const { title, description, tags} = req.body;

    const readingList = await ReadingList.findById(readingListId);

    if (!readingList) {
      return res.status(404).json({
        success: false,
        message: 'Reading list not found',
      });
    }

    if (!isOwner(readingList, req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this reading list',
      });
    }

    if (title) readingList.title = title;
    
    if (description !== undefined) readingList.description = description;
    
    if (tags) readingList.tags = tags;

    const updatedList = await readingList.save();

    return res.status(200).json({
      success: true,
      message: 'Reading list updated',
      data: updatedList
    });

  } catch (error) {
    const invalidId = handleInvalidObjectId(error, res);
    if (invalidId) return invalidId;
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: 'You already have a list with this name' 
      });
    }
    console.error('Error updating reading list:', error);
    res.status(500).json({ message: err.message });

  }
};

exports.addBookToReadingList = async (req, res) => {
  try {
    const { readingListId } = req.params;
    const { bookId } = req.body;

    const readingList = await ReadingList.findById(readingListId);
    
    if (!readingList) {
      return res.status(404).json({ success: false, message: 'Reading list not found.' });
    }

    if (!isOwner(readingList, req.user.id)) {
      return res.status(403).json({ success: false, message: 'You are not authorized to modify this reading list.' });
    }

    const bookExists = await Book.exists({ _id: bookId });
    if (!bookExists) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }

    const isDuplicate = readingList.books.some(id => id.toString() === bookId);
    
    if (isDuplicate) {
      return res.status(409).json({ 
        success: false, 
        message: 'This book is already in your reading list' 
      });
    }

    readingList.books.push(bookId);
    await readingList.save();

    const populated = await ReadingList.findById(readingList._id)
        .populate('books', 'title author')
        .populate('ownerId', 'username');

    return res.status(200).json({ success: true, data: populated });

  } catch (error) {
    const invalidId = handleInvalidObjectId(error, res);
    if (invalidId) return invalidId;

    console.error('Error adding book to reading list:', error);
    return res.status(500).json({ success: false, message: 'Server error while adding book to reading list' });
  }
};

exports.removeBookFromReadingList = async (req, res) => {
  try {
    const { readingListId, bookId } = req.params;

    const readingList = await ReadingList.findById(readingListId);

    if (!readingList) {
      return res.status(404).json({ success: false, message: 'Reading list not found.' });
    }

    if (!isOwner(readingList, req.user.id)) {
      return res.status(403).json({ success: false, message: 'You are not authorized to modify this reading list.' });
    }

    const isBookInList = readingList.books.some(id => id.toString() === bookId);
    
    if (!isBookInList) {
      return res.status(404).json({
        success: false, 
        message: 'Book not found in this reading list.' 
      });
    }

    readingList.books.pull(bookId);
    
    await readingList.save();

    const populated = await ReadingList.findById(readingList._id)
        .populate('books', 'title author')
        .populate('ownerId', 'username');

    return res.status(200).json({ success: true, data: populated });

  } catch (error) {
    const invalidId = handleInvalidObjectId(error, res);
    if (invalidId) return invalidId;

    console.error('Error removing book from reading list:', error);
    return res.status(500).json({ success: false, message: 'Server error while removing book from reading list' });
  }
};