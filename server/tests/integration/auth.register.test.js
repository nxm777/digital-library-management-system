const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const { deleteField } = require('../utils/deleteField');
const { expectValidationErrors } = require('../utils/expectValidationErrors');

jest.mock(require.resolve('../../middleware/rateLimit'), () => ({
  registerLimiter: (req, res, next) => next(),
}));

const VALID_INPUT = {
    firstName: 'Jan',
    lastName: 'Kowalski',
    username: 'janek123',
    email: 'janek@example.com',
    password: 'StrongP@ssw0rd',
};

const REQUIRED_FIELD = [
    ['firstName', 'First name is required'],
    ['lastName',  'Last name is required'],
    ['username',  'Username is required'],
    ['email',     'Email is required'],
    ['password',  'Password is required'],
];

async function expectNoUserCreated(email) {
  const userInDb = await User.findOne({ email }).lean();
  expect(userInDb).toBeNull();
}

describe('POST /auth/register', () => {
    it('returns 201 and creates a user for valid input', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send(VALID_INPUT);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('email', VALID_INPUT.email);
        expect(res.body.user).toHaveProperty('username', VALID_INPUT.username);
        expect(res.body.user).not.toHaveProperty('password');
        expect(res.body).toHaveProperty('token');

        const userInDb = await User.findOne({ email: VALID_INPUT.email }).lean();
        expect(userInDb).toBeTruthy();
        expect(userInDb.password).not.toBe(VALID_INPUT.password);
    });

    it.each(REQUIRED_FIELD)('returns 422 when %s is missing', async (missingField, expectedMsg) => {
        const payload = { ...VALID_INPUT };
        deleteField(payload, missingField);

        const res = await request(app).post('/auth/register').send(payload);

        expectValidationErrors(res, [expectedMsg]);
        await expectNoUserCreated(payload.email);
    });

    it('returns 422 with multiple messages when multiple fields are missing', async () => {
        const { firstName, password, ...partial } = VALID_INPUT;

        const res = await request(app).post('/auth/register').send(partial);

        expectValidationErrors(res, [
            'First name is required',
            'Password is required'
        ]);
    });

    it('returns 422 for invalid email format', async () => {
        const payload = {
          ...VALID_INPUT,
          email: 'not-an-email',
        };

        const res = await request(app).post('/auth/register').send(payload);

        expectValidationErrors(res, ['Please enter a valid email address']);
        await expectNoUserCreated(payload.email);
    });

    it('returns 422 when firstName is shorter than 2 characters', async () => {
        const payload = {
          ...VALID_INPUT,
          firstName: 'A'
        };
  
        const res = await request(app).post('/auth/register').send(payload);

        expectValidationErrors(res, ['First name must be between 2 and 30 characters']);
        await expectNoUserCreated(payload.email);
    });

    it('returns 422 when firstName exceeds 30 characters', async () => {
        const tooLong = 'A'.repeat(31);
        const payload = {
          ...VALID_INPUT,
          firstName: tooLong
        };
    
        const res = await request(app).post('/auth/register').send(payload);
        
        expectValidationErrors(res, ['First name must be between 2 and 30 characters']);
        await expectNoUserCreated(payload.email);
    });

    it('returns 422 when lastName is shorter than 2 characters', async () => {
        const payload = {
          ...VALID_INPUT,
          lastName: 'A'
        };
    
        const res = await request(app).post('/auth/register').send(payload);

        expectValidationErrors(res, ['Last name must be between 2 and 60 characters']);
        await expectNoUserCreated(payload.email);
    });

    it('returns 422 when lastName exceeds 60 characters', async () => {
        const tooLong = 'A'.repeat(61);
        const payload = {
          ...VALID_INPUT,
          lastName: tooLong,
        };
    
        const res = await request(app).post('/auth/register').send(payload);
    
        expectValidationErrors(res, ['Last name must be between 2 and 60 characters']);
        await expectNoUserCreated(payload.email);
    });

    it('returns 422 when username is shorter than 3 characters', async () => {
        const payload = {
          ...VALID_INPUT,
          username: 'ab'
        };

        const res = await request(app).post('/auth/register').send(payload);

        expectValidationErrors(res, ['Username must be between 3 and 40 characters']);
        await expectNoUserCreated(payload.email);
    });

    it('returns 422 when username exceeds 40 characters', async () => {
        const tooLong = 'a'.repeat(41);
        const payload = {
            ...VALID_INPUT,
            username: tooLong
        };

        const res = await request(app).post('/auth/register').send(payload);

        expectValidationErrors(res, ['Username must be between 3 and 40 characters']);
        await expectNoUserCreated(payload.email);
    });

    it('returns 409 when email already exists', async () => {
        const base = {
          ...VALID_INPUT,
          email: `dup_${Date.now()}@example.com`,
        };
    
        const ok = await request(app).post('/auth/register').send(base);
        expect(ok.statusCode).toBe(201);
    
        const second = {
          ...VALID_INPUT,
          username: `test`,
          email: base.email,
        };

        const res = await request(app).post('/auth/register').send(second);
    
        expect(res.statusCode).toBe(409);
        expect(res.body).toEqual({ message: 'User with that email or username already exists.' });

        const count = await User.countDocuments({ email: base.email });
        expect(count).toBe(1);
    });

    it('returns 409 when username already exists', async () => {
        const first = {
          ...VALID_INPUT,
          email: `u_${Date.now()}@example.com`,
        };

        const ok = await request(app).post('/auth/register').send(first);
        expect(ok.statusCode).toBe(201);

        const dup = {
          ...VALID_INPUT,
          email: `u2_${Date.now()}@example.com`,
        };

        const res = await request(app).post('/auth/register').send(dup);

        expect(res.statusCode).toBe(409);
        expect(res.body).toEqual({ message: 'User with that email or username already exists.'})   

        const count = await User.countDocuments({ username: VALID_INPUT.username });
        expect(count).toBe(1);
    });

    const CASES_PASSWD = [
      {
        title: 'is empty',
        password: '',
        expectedMsg: 'Password is required',
      },
      {
        title: 'is shorter than 8 characters',
        password: 'Ab1@a',
        expectedMsg: 'Password must be at least 8 characters long',
      },
      {
        title: 'has no lowercase letter',
        password: 'AAAAAAA1!',
        expectedMsg: 'Password must contain at least one lowercase letter',
      },
      {
        title: 'has no uppercase letter',
        password: 'aaaaaaa1!',
        expectedMsg: 'Password must contain at least one uppercase letter',
      },
      {
        title: 'has no number',
        password: 'AAAAaaaa!',
        expectedMsg: 'Password must contain at least one number',
      },
      {
        title: 'has no special character',
        password: 'AAAAaaaa1',
        expectedMsg: 'Password must contain at least one special character',
      },
    ];

    it.each(CASES_PASSWD)('returns 422 when password $title', async ({ password, expectedMsg }) => {
        const uniq = () => `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const id = uniq();
        const payload = {
          ...VALID_INPUT,
          username: `pwd_${id}`,
          email: `pwd_${id}@example.com`,
          password,
        };

        const res = await request(app).post('/auth/register').send(payload);

        expectValidationErrors(res, [expectedMsg]);
        await expectNoUserCreated(payload.email);
    });

    const CASES_USERNAME = [
      {
        title: 'is empty (after trim)',
        username: '   ',
        expectedMsg: 'Username is required',
      },
      {
        title: 'is shorter than 3 characters',
        username: 'ab',
        expectedMsg: 'Username must be between 3 and 40 characters',
      },
      {
        title: 'exceeds 40 characters',
        username: 'a'.repeat(41),
        expectedMsg: 'Username must be between 3 and 40 characters',
      },
      {
        title: 'contains underscore',
        username: 'john_doe',
        expectedMsg: 'Username can only contain letters, numbers, and single spaces between words',
      },
      {
        title: 'contains hyphen',
        username: 'john-doe',
        expectedMsg: 'Username can only contain letters, numbers, and single spaces between words',
      },
      {
        title: 'contains special character',
        username: 'john@doe',
        expectedMsg: 'Username can only contain letters, numbers, and single spaces between words',
      },
      {
        title: 'contains double space',
        username: 'john  doe',
        expectedMsg: 'Username can only contain letters, numbers, and single spaces between words',
      },
    ];

    it.each(CASES_USERNAME)('returns 422 when username $title', async ({ username, expectedMsg }) => {
        const uniq = () => `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const id = uniq();
        const payload = {
          ...VALID_INPUT,
          username,
          email: `u_${id}@example.com`,
        };
    
        const res = await request(app).post('/auth/register').send(payload);
    
        expectValidationErrors(res, [expectedMsg]);
        await expectNoUserCreated(payload.email);
    });
});