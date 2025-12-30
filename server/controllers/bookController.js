const Book = require('../models/Book');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { handleDuplicateKeyError, handleInvalidObjectId } = require('../utils/handleErrors');

const uploadBookImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: process.env.CLOUDINARY_FOLDER_NAME },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

exports.createBook = async (req, res) => {
    let uploadedPublicId = null;

    try {
        let bookDetails = { ...req.body };
        let imageUrl = '';

        if (req.file) {
            const result = await uploadBookImageToCloudinary(req.file.buffer);
            
            imageUrl = result.secure_url;
            uploadedPublicId = result.public_id;
            
        }

        const bookData = {
            ...bookDetails,
            imageUrl: imageUrl
        };

        const book = new Book(bookData);
        const saved = await book.save();
        
        res.status(201).json(saved);

    } catch (err) {

        if (uploadedPublicId) {
            try {
                await cloudinary.uploader.destroy(uploadedPublicId);
            } catch (deleteErr) {
                console.error(deleteErr);
            }
        }

        const handled = handleDuplicateKeyError(err, res);
        if (handled) return handled;

        res.status(500).json({ message: err.message });
    }
};

exports.getAllBooks = async (req, res) => {

    const queryObj = {};

    if (req.query.author) {
        queryObj['author.last_name'] = req.query.author;
    }

    if (req.query.genre) {
        queryObj.genres = req.query.genre;
    }

    if (req.query.search) {
        queryObj.$or = [
            { 
                title: { $regex: req.query.search, $options: 'i' } 
            },
            { 
                'author.last_name': { $regex: req.query.search, $options: 'i' } 
            },
            { 
                'author.first_name': { $regex: req.query.search, $options: 'i' } 
            }
        ];
    }

    const sortBy = {};
    if (req.query.sort) {
        req.query.sort.split(',').forEach(s => {
        if (s.startsWith('-')) sortBy[s.substring(1)] = -1;
        else sortBy[s] = 1;
        });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    
    try {
        const books = await Book.find(queryObj)
        .sort(sortBy)
        .skip(skip)
        .limit(limit);

        const total = await Book.countDocuments(queryObj);

        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: books
          });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBookById = async (req, res) => {

    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        const invalidId = handleInvalidObjectId(err, res);
        if (invalidId) return invalidId;
        res.status(500).json({ message: err.message });
    }
};

exports.updateBook = async (req, res) => {
    let newUploadedPublicId = null;

    try {
        const oldBook = await Book.findById(req.params.id);
        if (!oldBook) return res.status(404).json({ message: 'Book not found' });

        let updateData = { ...req.body };

        if (req.file) {
            const uploadResult = await uploadBookImageToCloudinary(req.file.buffer);
            
            updateData.imageUrl = uploadResult.secure_url;
            newUploadedPublicId = uploadResult.public_id;
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (newUploadedPublicId && oldBook.imageUrl) {
            const oldPublicId = getPublicIdFromUrl(oldBook.imageUrl);
            if (oldPublicId) {
                cloudinary.uploader.destroy(oldPublicId).catch(err => 
                    console.error(err)
                );
            }
        }

        console.log('Book updated:', updatedBook);
        res.json(updatedBook);

    } catch (err) {

        if (newUploadedPublicId) {
            await cloudinary.uploader.destroy(newUploadedPublicId);
        }

        const invalidId = handleInvalidObjectId(err, res);
        if (invalidId) return invalidId;
        
        const handled = handleDuplicateKeyError(err, res);
        if (handled) return handled;

        res.status(400).json({ message: err.message });
    }
};

exports.deleteBook = async (req, res) => {

    try {
        const id = req.params.id;
        const deleted = await Book.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted' });
        console.log('Book deleted:', deleted);

    } catch (err) {
        const invalidId = handleInvalidObjectId(err, res);
        if (invalidId) return invalidId;
        res.status(400).json({ message: err.message });
    }
};