function handleDuplicateKeyError(err, res) {
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            message: 'Validation failed',
            errors: [{ message: `${field} must be unique` }]
        });
    }
    return null;
}

function handleInvalidObjectId(err, res) {
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({ message: `Invalid ID format` });
    }
    return null;
}

module.exports = {
    handleDuplicateKeyError,
    handleInvalidObjectId
};