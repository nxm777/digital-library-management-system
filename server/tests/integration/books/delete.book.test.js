const request = require('supertest');
const app = require('../../../app');
const Book = require('../../../models/Book');
const { createAdminAndGetToken } = require('../../utils/createAuthorizedUser');
const mongoose = require('mongoose');

const VALID_INPUT = {
    title: "Ostatnie Życzenie",
    author: {
        first_name: "Andrzej",
        last_name: "Sapkowski"
    },
    isbn: "9788375780635",
    publisher: "SuperNowa",
    genres: ["fantasy"],
    numOfPages: 332,
    publicationYear: 2014
};

let token;
beforeEach(async () => {
    await Book.deleteMany({});
    token = await createAdminAndGetToken();
});

describe('DELETE /api/books/:id', () => {
    it('returns 200 and deletes the document with the given id', async () => {
        const payload = { ...VALID_INPUT };
        const createRes = await request(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .send(payload);
        
        expect(createRes.statusCode).toBe(201);
        const createdId = createRes.body._id;

        const deleteRes = await request(app)
            .delete(`/api/books/${createdId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(deleteRes.statusCode).toBe(200);
        expect(deleteRes.body.message).toBe("Book deleted");

        const inDb = await Book.findById(createdId);
        expect(inDb).toBeNull();
        
    });

    it('returns 404 for resource not found', async () => {
        const deleteRes = await request(app)
            .delete(`/api/books/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(deleteRes.statusCode).toBe(404);
        expect(deleteRes.body.message).toBe("Book not found");
    });

    it('returns 400 for invalid ID format', async () => {
        const deleteRes = await request(app)
            .delete(`/api/books/1`)
            .set('Authorization', `Bearer ${token}`);

        expect(deleteRes.statusCode).toBe(400);
        expect(deleteRes.body.message).toBe("Invalid ID format");
    });

    it('returns 401 when no token is provided', async () => {
    const res = await request(app)
    .delete(`/api/books/whatever-id`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Authorization header missing or malformed");
});

})