import { jest } from '@jest/globals';

// Mock the database pool
jest.unstable_mockModule('../../configs/db.js', () => ({
  default: {
    query: jest.fn()
  }
}));

const { default: pool } = await import('../../configs/db.js');
const { default: MatchingService } = await import('../../services/matching.service.js');

describe('MatchingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseProjectSkills', () => {
    it('should parse array of skills', () => {
      const project = { skills: ['React', 'Node.js', 'PostgreSQL'] };
      const result = MatchingService.parseProjectSkills(project);

      expect(result).toEqual(['react', 'node.js', 'postgresql']);
    });

    it('should parse JSON string of skills', () => {
      const project = { skills: '["React", "Node.js"]' };
      const result = MatchingService.parseProjectSkills(project);

      expect(result).toEqual(['react', 'node.js']);
    });

    it('should parse comma-separated string of skills', () => {
      const project = { skills: 'React, Node.js, Python' };
      const result = MatchingService.parseProjectSkills(project);

      expect(result).toEqual(['react', 'node.js', 'python']);
    });

    it('should handle empty skills', () => {
      const project = { skills: [] };
      const result = MatchingService.parseProjectSkills(project);

      expect(result).toEqual([]);
    });
  });

  describe('calculateCosineSimilarity', () => {
    it('should return 1 for identical skill sets', () => {
      const userVector = { react: 1, nodejs: 1 };
      const projectSkills = ['react', 'nodejs'];
      const idfMap = { react: 1, nodejs: 1 };

      const result = MatchingService.calculateCosineSimilarity(
        userVector,
        projectSkills,
        idfMap
      );

      expect(result).toBeCloseTo(1, 2);
    });

    it('should return 0 for completely different skill sets', () => {
      const userVector = { python: 1, django: 1 };
      const projectSkills = ['react', 'nodejs'];
      const idfMap = { python: 1, django: 1, react: 1, nodejs: 1 };

      const result = MatchingService.calculateCosineSimilarity(
        userVector,
        projectSkills,
        idfMap
      );

      expect(result).toBe(0);
    });

    it('should return partial match for overlapping skills', () => {
      const userVector = { react: 1, python: 1 };
      const projectSkills = ['react', 'nodejs'];
      const idfMap = { react: 1, python: 1, nodejs: 1 };

      const result = MatchingService.calculateCosineSimilarity(
        userVector,
        projectSkills,
        idfMap
      );

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });

    it('should handle empty user vector', () => {
      const userVector = {};
      const projectSkills = ['react', 'nodejs'];
      const idfMap = { react: 1, nodejs: 1 };

      const result = MatchingService.calculateCosineSimilarity(
        userVector,
        projectSkills,
        idfMap
      );

      expect(result).toBe(0);
    });

    it('should handle empty project skills', () => {
      const userVector = { react: 1, nodejs: 1 };
      const projectSkills = [];
      const idfMap = { react: 1, nodejs: 1 };

      const result = MatchingService.calculateCosineSimilarity(
        userVector,
        projectSkills,
        idfMap
      );

      expect(result).toBe(0);
    });
  });

  describe('calculateInterestBoost', () => {
    it('should return boost for matching interests', () => {
      const project = {
        title: 'Machine Learning Project',
        description: 'A project about AI and machine learning'
      };
      const userInterests = { 'machine learning': 1.0, 'ai': 0.7 };

      const result = MatchingService.calculateInterestBoost(project, userInterests);

      expect(result.boost).toBeGreaterThan(0);
      expect(result.matchCount).toBeGreaterThan(0);
    });

    it('should return no boost for non-matching interests', () => {
      const project = {
        title: 'Web Development',
        description: 'Building websites'
      };
      const userInterests = { 'machine learning': 1.0, 'data science': 0.7 };

      const result = MatchingService.calculateInterestBoost(project, userInterests);

      expect(result.boost).toBe(0);
      expect(result.matchCount).toBe(0);
    });
  });

  describe('calculateRecencyScore', () => {
    it('should return higher score for recent posts', () => {
      const recentDate = new Date();
      const result = MatchingService.calculateRecencyScore(recentDate);

      expect(result).toBeGreaterThan(0.05);
    });

    it('should return lower score for older posts', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 60);

      const result = MatchingService.calculateRecencyScore(oldDate);

      expect(result).toBeLessThan(0.05);
    });

    it('should return 0 for null date', () => {
      const result = MatchingService.calculateRecencyScore(null);

      expect(result).toBe(0);
    });
  });

  describe('calculateEngagementScore', () => {
    it('should return higher score for popular posts', () => {
      const stats = { views: 1000, likes: 100 };
      const result = MatchingService.calculateEngagementScore(stats);

      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 for null stats', () => {
      const result = MatchingService.calculateEngagementScore(null);

      expect(result).toBe(0);
    });

    it('should cap the score at 0.15', () => {
      const stats = { views: 100000, likes: 10000 };
      const result = MatchingService.calculateEngagementScore(stats);

      expect(result).toBeLessThanOrEqual(0.15);
    });
  });

  describe('getMatchedProjects', () => {
    it('should return empty matches when no projects exist', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await MatchingService.getMatchedProjects(1);

      expect(result.matches).toHaveLength(0);
      expect(result.meta.totalProjects).toBe(0);
    });

    it('should calculate match scores for projects', async () => {
      // Mock projects query
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            title: 'React Project',
            skills: ['React', 'Node.js'],
            description: 'A web app',
            authorId: 2,
            authorName: 'John',
            createdAt: new Date(),
            stats: { views: 100, likes: 10 },
            members: []
          }
        ]
      });

      // Mock user skills query
      pool.query.mockResolvedValueOnce({
        rows: [{ skillTitle: 'React', portfolio: 'https://example.com' }]
      });

      // Mock user interests query
      pool.query.mockResolvedValueOnce({
        rows: [{ interestTitle: 'Web Development', interestLevel: 'High' }]
      });

      // Mock IDF query
      pool.query.mockResolvedValueOnce({
        rows: [
          { skillTitle: 'React', user_count: 10, total_users: 100 },
          { skillTitle: 'Node.js', user_count: 20, total_users: 100 }
        ]
      });

      const result = await MatchingService.getMatchedProjects(1);

      expect(result.matches).toBeDefined();
      expect(result.meta.algorithm).toBe('skill-match-v1');
    });
  });
});
