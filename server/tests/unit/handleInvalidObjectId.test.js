const { handleInvalidObjectId } = require('../../utils/handleErrors');

describe('handleInvalidObjectId function', () => {
  let res;

  beforeEach(() => {
    res = {

      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 400 JSON response when error is CastError and kind is ObjectId', () => {

    const error = {
      name: 'CastError',
      kind: 'ObjectId'
    };

    handleInvalidObjectId(error, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
  });

  it('should return null and NOT send response if error name is not CastError', () => {
    const error = {
      name: 'ValidationError',
      kind: 'ObjectId'
    };

    const result = handleInvalidObjectId(error, res);

    expect(result).toBeNull();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return null if error kind is not ObjectId', () => {
    const error = {
      name: 'CastError',
      kind: 'Number'
    };

    const result = handleInvalidObjectId(error, res);

    expect(result).toBeNull();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return null if error object is malformed', () => {
    const error = {};
    const result = handleInvalidObjectId(error, res);
    expect(result).toBeNull();
  });
});