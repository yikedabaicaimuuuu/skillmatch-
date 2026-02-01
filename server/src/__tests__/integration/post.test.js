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

describe('Post API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/post/all', () => {
    it('should return all posts', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Test Project',
          description: 'A test project',
          skills: ['React', 'Node.js'],
          authorId: 1,
          authorName: 'Test User'
        },
        {
          id: 2,
          title: 'Another Project',
          description: 'Another test project',
          skills: ['Python', 'Django'],
          authorId: 2,
          authorName: 'Another User'
        }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockPosts });

      const response = await request(app)
        .get('/api/post/all')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe('Test Project');
    });

    it('should return empty array when no posts exist', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/post/all')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/post/:postId', () => {
    it('should return a specific post', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Project',
        description: 'A test project',
        skills: ['React', 'Node.js'],
        authorId: 1
      };

      // Mock post query
      pool.query.mockResolvedValueOnce({ rows: [mockPost] });
      // Mock members query
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/post/1')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe('Test Project');
    });

    it('should return 404 for non-existent post', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/post/999')
        .expect(404);

      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/post/create', () => {
    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/post/create')
        .send({
          description: 'A test project',
          skills: ['React']
        })
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });
});
