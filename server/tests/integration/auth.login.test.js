const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');

jest.mock('jsonwebtoken', () => ({ sign: () => 'test-token' }));

async function createUser(overrides = {}) {
    const doc = {
      firstName: 'Jan',
      lastName: 'Kowalski',
      username: `login`,
      email: `jankowalski@example.com`,
      password: 'StrongP@ssw0rd',
      ...overrides,
    };
    return User.create(doc);
}

describe('POST /auth/login', () => {
    it('returns 200, a token and user for valid credentials', async () => {
      const user = await createUser();
      const res = await request(app).post('/auth/login').send({
        emailOrUsername: user.email,
        password: 'StrongP@ssw0rd',
      });
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', user.email);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('returns 401 when password is incorrect', async () => {
        const user = await createUser();
        const res = await request(app).post('/auth/login').send({
            emailOrUsername: user.email,
            password: 'WrongP@ss1',
        });
    
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Invalid credentials.');
    });

    it('returns 401 when email/username does not exist', async () => {
        const res = await request(app).post('/auth/login').send({
          emailOrUsername: `noUser@example.com`,
          password: 'StrongP@ssw0rd'
        });
      
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Invalid credentials.');
        expect(res.body.token).toBeUndefined();
      });
})