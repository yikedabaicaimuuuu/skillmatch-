/**
 * AI Matching API Service
 * Client-side service for AI-powered project matching
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class MatchingService {
  /**
   * Get AI-matched projects for the current user
   */
  async getMatchedProjects(options = {}) {
    const { limit = 10, minScore = 0.1 } = options;

    try {
      const response = await fetch(`${API_URL}/matching/projects`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit, minScore })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get matched projects');
      }

      return data;
    } catch (error) {
      console.error('Error fetching matched projects:', error);
      throw error;
    }
  }

  /**
   * Get AI-matched users for a specific project
   */
  async getMatchedUsersForProject(projectId, limit = 10) {
    try {
      const response = await fetch(
        `${API_URL}/matching/users/${projectId}?limit=${limit}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get matched users');
      }

      return data;
    } catch (error) {
      console.error('Error fetching matched users:', error);
      throw error;
    }
  }

  /**
   * Get detailed explanation of match score for a project
   */
  async getMatchExplanation(projectId) {
    try {
      const response = await fetch(`${API_URL}/matching/explain/${projectId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get match explanation');
      }

      return data;
    } catch (error) {
      console.error('Error fetching match explanation:', error);
      throw error;
    }
  }
}

export default new MatchingService();
