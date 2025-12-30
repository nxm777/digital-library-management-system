const request = require('supertest');
const app = require('../../../app');
const Book = require('../../../models/Book');
const { createAdminAndGetToken } = require('../../utils/createAuthorizedUser');


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

describe('PUT /api/books/:id', () => {
    it('returns 200 and updates the book when valid data is provided', async () => {
        const createRes = await request(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .send(VALID_INPUT);

        const bookId = createRes.body._id;

        const updatePayload = {
            title: "Updated Title",
            numOfPages: 777,
        };

        const updateRes = await request(app)
            .put(`/api/books/${bookId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatePayload);

        expect(updateRes.statusCode).toBe(200);
        expect(updateRes.body.title).toBe(updatePayload.title);
        expect(updateRes.body.numOfPages).toBe(updatePayload.numOfPages);

        const inDb = await Book.findOne({ title: updatePayload.title });
        expect(inDb).not.toBeNull();
    });

    it('returns 404 when trying to update a non-existing book', async () => {
        const invalidId = "675bc2d5f5d4a34b2a8aaa99";
        const res = await request(app)
            .put(`/api/books/${invalidId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: "Doesn't matter" });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Book not found");
    });

    it('returns 400 when ID format is invalid', async () => {
        const res = await request(app)
            .put('/api/books/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: "new title" });

        expect(res.statusCode).toBe(400);
    });

    it('returns 401 when no token is provided', async () => {
        const res = await request(app)
            .put('/api/books/675bc2d5f5d4a34b2a8aaa99')
            .send({ title: "New title" });

        expect(res.statusCode).toBe(401);
    });
})