const request = require('supertest');
const app = require('../../../app');
const { createAdminAndGetToken } = require('../../utils/createAuthorizedUser');
const Book = require('../../../models/Book');


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

beforeEach(async () => {
    await Book.deleteMany({});
    token = await createAdminAndGetToken();
});

describe('GET /api/books', () => {
    it('returns 200 and list of books', async () => {

        await request(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .send(VALID_INPUT);

        await request(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .send({ ...VALID_INPUT, isbn: "9788375780666" });

        const res = await request(app)
            .get('/api/books');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('returns 200 and returns book with given id', async () => {

        const createRes = await request(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .send(VALID_INPUT);

        expect(createRes.statusCode).toBe(201);
        const id = createRes.body._id;

        const getRes = await request(app)
            .get(`/api/books/${id}`);

        expect(getRes.statusCode).toBe(200);
        expect(getRes.body).toBeDefined();
        expect(getRes.body._id).toBe(id);
        expect(getRes.body.title).toBe("Ostatnie Życzenie");
        expect(getRes.body.author.last_name).toBe("Sapkowski");
    });

    it('returns 404 when book does not exist', async () => {
        const nonExistingId = "691674ad036b1e2cc04eec78";

        const res = await request(app)
            .get(`/api/books/${nonExistingId}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Book not found");
    });

    it('returns 400 when ID format is invalid', async () => {
        const res = await request(app)
            .get(`/api/books/123`);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid ID format");
    });
});