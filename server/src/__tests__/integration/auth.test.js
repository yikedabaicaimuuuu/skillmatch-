import { jest } from '@jest/globals';
import request from 'supertest';

// Mock database pool
jest.unstable_mockModule('../../configs/db.js', () => ({
  default: {
    query: jest.fn()
  }
}));

// Mock nodemailer
jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: jest.fn(() => ({
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' })
    }))
  }
}));

// Mock redis service
jest.unstable_mockModule('../../services/redis.service.js', () => ({
  default: {
    storeOTP: jest.fn().mockResolvedValue('123456'),
    verifyOTP: jest.fn().mockResolvedValue(true)
  }
}));

const { default: pool } = await import('../../configs/db.js');
const { default: app } = await import('../../app.js');

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.status).toBe('error');
    });

    it('should return 400 if email already exists', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: 'test@example.com' }]
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          fullName: 'Test User',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toContain('already registered');
    });

    it('should register user successfully', async () => {
      // Mock: no existing user
      pool.query.mockResolvedValueOnce({ rows: [] });
      // Mock: create user
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: 'newuser@example.com', fullName: 'New User' }]
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'newuser@example.com',
          fullName: 'New User',
          password: 'password123'
        })
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('user registered successfully');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(400);

      expect(response.body.status).toBe('error');
    });

    it('should return 400 for invalid email', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toContain('invalid');
    });
  });

  describe('POST /api/auth/generateOtp', () => {
    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/generateOtp')
        .send({})
        .expect(400);

      expect(response.body.status).toBe('error');
    });

    it('should return 400 if user not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/auth/generateOtp')
        .send({ email: 'nonexistent@example.com' })
        .expect(400);

      expect(response.body.message).toContain('no user found');
    });
  });

  describe('POST /api/auth/changePassword', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/changePassword')
        .send({ newPassword: 'newpass123' })
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });
});
