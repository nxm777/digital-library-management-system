const request = require('supertest');
const app = require('../../../app');
const Book = require('../../../models/Book');
const { createAdminAndGetToken } = require('../../utils/createAuthorizedUser');
const { expectValidationErrors } = require('../../utils/expectValidationErrors');
const { deleteField } = require('../../utils/deleteField');

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

const REQUIRED_FIELDS = [
    ['title', 'Title is required'],
    ['author.first_name', 'First name is required'],
    ['author.last_name', 'Last name is required'],
    ['isbn', 'ISBN is required'],
    ['publisher', 'Publisher is required'],
    ['numOfPages', 'Number of pages is required'],
    ['publicationYear', 'Publication year is required'],
];

let token;
beforeEach(async () => {
    await Book.deleteMany({});
    token = await createAdminAndGetToken();
});

describe('POST /api/books', () => {
    it('returns 201 and created document for valid input', async () => {
        const payload = { ...VALID_INPUT };
        const res = await request(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .send(payload)

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe(payload.title);
        expect(res.body.author).toStrictEqual(payload.author);

        const inDb = await Book.findOne({ title: payload.title });
        expect(inDb).not.toBeNull();
    })

    it.each(REQUIRED_FIELDS)('returns 422 when %s is missing', async (missingField, expectedMsg) => {
            const payload = { ...VALID_INPUT };
            deleteField(payload, missingField);
            const res = await request(app)
                .post('/api/books')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            expectValidationErrors(res, [expectedMsg]);
        }
    );

    it('returns 422 for invalid isbn format', async() => {
        const payload = { ...VALID_INPUT, isbn: '123456789' };
        const res = await request(app)
                .post('/api/books')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

        expect(res.statusCode).toBe(422);
        expectValidationErrors(res, ["Invalid ISBN format"]);

    })
})