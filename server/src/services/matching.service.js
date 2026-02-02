/**
 * AI-powered Skill Matching Service
 *
 * This service implements an intelligent matching algorithm that connects
 * users with projects based on their skills and interests using:
 * - TF-IDF weighted skill matching
 * - Cosine similarity for relevance scoring
 * - Interest-based boosting
 * - Collaborative filtering signals
 */

import pool from "../configs/db.js";
import errorThrower from "../helper/errorThrower.js";

class MatchingService {
  /**
   * Calculate TF-IDF weight for a skill
   * TF = frequency of skill in user's profile
   * IDF = log(total users / users with this skill)
   */
  async calculateSkillIDF() {
    try {
      const sql = `
        SELECT s."skillTitle",
               COUNT(DISTINCT us."userId") as user_count,
               (SELECT COUNT(DISTINCT id) FROM "user") as total_users
        FROM "skill" s
        LEFT JOIN "userSkill" us ON s.id = us."skillId"
        GROUP BY s.id, s."skillTitle"
      `;
      const result = await pool.query(sql);

      const idfMap = {};
      result.rows.forEach(row => {
        const totalUsers = parseInt(row.total_users) || 1;
        const userCount = parseInt(row.user_count) || 1;
        // IDF = log(N / df) + 1 (smoothed)
        idfMap[row.skillTitle.toLowerCase()] = Math.log(totalUsers / userCount) + 1;
      });

      return idfMap;
    } catch (error) {
      console.error("Error calculating IDF:", error);
      return {};
    }
  }

  /**
   * Get user's skill vector with weights
   */
  async getUserSkillVector(userId) {
    try {
      const sql = `
        SELECT s."skillTitle", us."description", us."portfolio"
        FROM "userSkill" us
        INNER JOIN "skill" s ON s.id = us."skillId"
        WHERE us."userId" = $1
      `;
      const result = await pool.query(sql, [userId]);

      const skills = {};
      result.rows.forEach(row => {
        // Weight based on portfolio presence (indicates expertise)
        const weight = row.portfolio ? 1.5 : 1.0;
        skills[row.skillTitle.toLowerCase()] = weight;
      });

      return skills;
    } catch (error) {
      console.error("Error getting user skills:", error);
      return {};
    }
  }

  /**
   * Get user's interests with levels
   */
  async getUserInterests(userId) {
    try {
      const sql = `
        SELECT i."interestTitle", ui."interestLevel"
        FROM "userInterest" ui
        INNER JOIN "interest" i ON i.id = ui."interestId"
        WHERE ui."userId" = $1
      `;
      const result = await pool.query(sql, [userId]);

      const interests = {};
      const levelWeights = { 'High': 1.0, 'Medium': 0.7, 'Low': 0.4 };

      result.rows.forEach(row => {
        interests[row.interestTitle.toLowerCase()] = levelWeights[row.interestLevel] || 0.5;
      });

      return interests;
    } catch (error) {
      console.error("Error getting user interests:", error);
      return {};
    }
  }

  /**
   * Extract skills from project and normalize
   */
  parseProjectSkills(project) {
    let skills = [];

    if (Array.isArray(project.skills)) {
      skills = project.skills;
    } else if (typeof project.skills === 'string') {
      try {
        skills = JSON.parse(project.skills);
      } catch {
        skills = project.skills.split(',').map(s => s.trim());
      }
    }

    return skills.map(s => s.toLowerCase().trim());
  }

  /**
   * Calculate cosine similarity between user skills and project requirements
   */
  calculateCosineSimilarity(userVector, projectSkills, idfMap) {
    if (projectSkills.length === 0 || Object.keys(userVector).length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let userMagnitude = 0;
    let projectMagnitude = 0;

    // Calculate dot product and magnitudes
    const allSkills = new Set([
      ...Object.keys(userVector),
      ...projectSkills
    ]);

    allSkills.forEach(skill => {
      const userWeight = userVector[skill] || 0;
      const projectWeight = projectSkills.includes(skill) ? 1 : 0;
      const idf = idfMap[skill] || 1;

      const userTfIdf = userWeight * idf;
      const projectTfIdf = projectWeight * idf;

      dotProduct += userTfIdf * projectTfIdf;
      userMagnitude += userTfIdf * userTfIdf;
      projectMagnitude += projectTfIdf * projectTfIdf;
    });

    userMagnitude = Math.sqrt(userMagnitude);
    projectMagnitude = Math.sqrt(projectMagnitude);

    if (userMagnitude === 0 || projectMagnitude === 0) {
      return 0;
    }

    return dotProduct / (userMagnitude * projectMagnitude);
  }

  /**
   * Calculate interest boost based on project description matching user interests
   */
  calculateInterestBoost(project, userInterests) {
    const description = (project.description || '').toLowerCase();
    const title = (project.title || '').toLowerCase();
    const content = `${title} ${description}`;

    let boost = 0;
    let matchCount = 0;

    Object.entries(userInterests).forEach(([interest, weight]) => {
      if (content.includes(interest)) {
        boost += weight * 0.2; // 20% boost per matching interest
        matchCount++;
      }
    });

    return { boost, matchCount };
  }

  /**
   * Calculate recency score (newer projects get slight boost)
   */
  calculateRecencyScore(createdAt) {
    if (!createdAt) return 0;

    const now = new Date();
    const created = new Date(createdAt);
    const daysDiff = (now - created) / (1000 * 60 * 60 * 24);

    // Exponential decay: recent posts get higher scores
    return Math.exp(-daysDiff / 30) * 0.1; // Max 10% boost for very recent posts
  }

  /**
   * Calculate engagement score based on views and likes
   */
  calculateEngagementScore(stats) {
    if (!stats) return 0;

    const views = stats.views || 0;
    const likes = stats.likes || 0;

    // Normalize and weight (likes matter more than views)
    const viewScore = Math.log(views + 1) / 10;
    const likeScore = Math.log(likes + 1) / 5;

    return Math.min((viewScore + likeScore) * 0.1, 0.15); // Max 15% boost
  }

  /**
   * Calculate search relevance score based on keyword matching
   */
  calculateSearchRelevance(project, searchQuery) {
    if (!searchQuery || !searchQuery.trim()) {
      return { score: 0, matches: [] };
    }

    const query = searchQuery.toLowerCase().trim();
    const keywords = query.split(/\s+/).filter(k => k.length > 1);

    const title = (project.title || '').toLowerCase();
    const description = (project.description || '').toLowerCase();
    const skills = this.parseProjectSkills(project);
    const content = `${title} ${description} ${skills.join(' ')}`;

    let score = 0;
    const matches = [];

    keywords.forEach(keyword => {
      // Title match (highest weight)
      if (title.includes(keyword)) {
        score += 0.4;
        matches.push({ field: 'title', keyword });
      }
      // Skills match (high weight)
      if (skills.some(skill => skill.includes(keyword))) {
        score += 0.35;
        matches.push({ field: 'skills', keyword });
      }
      // Description match (medium weight)
      if (description.includes(keyword)) {
        score += 0.25;
        matches.push({ field: 'description', keyword });
      }
    });

    // Normalize by keyword count
    const normalizedScore = keywords.length > 0 ? score / keywords.length : 0;

    return {
      score: Math.min(normalizedScore, 1),
      matches,
      keywords
    };
  }

  /**
   * Main matching function - finds best projects for a user
   */
  async getMatchedProjects(userId, options = {}) {
    const { limit = 10, minScore = 0.1, searchQuery = '' } = options;

    try {
      // Get all projects
      const projectsSql = `
        SELECT p.*, u."fullName" as "authorName", u."email" as "authorEmail",
               COALESCE(
                   json_agg(
                       json_build_object(
                           'userId', pm."userId",
                           'name', mu."fullName",
                           'role', pm."role",
                           'status', pm."status"
                       )
                   ) FILTER (WHERE pm."userId" IS NOT NULL),
                   '[]'::json
               ) AS members
        FROM "post" p
        INNER JOIN "user" u ON p."authorId" = u.id
        LEFT JOIN "post_member" pm ON p.id = pm."projectId"
        LEFT JOIN "user" mu ON pm."userId" = mu.id
        WHERE p."authorId" != $1
        GROUP BY p.id, u."fullName", u."email"
        ORDER BY p."createdAt" DESC
      `;
      const projectsResult = await pool.query(projectsSql, [userId]);
      let projects = projectsResult.rows;

      // If search query provided, filter projects first
      const hasSearchQuery = searchQuery && searchQuery.trim().length > 0;

      if (hasSearchQuery) {
        // Pre-filter: only keep projects with some search relevance
        projects = projects.filter(project => {
          const { score } = this.calculateSearchRelevance(project, searchQuery);
          return score > 0;
        });
      }

      if (projects.length === 0) {
        return {
          matches: [],
          meta: {
            totalProjects: 0,
            algorithm: 'skill-match-v2',
            searchQuery: searchQuery || null,
            message: hasSearchQuery ? 'No projects match your search query' : 'No projects available'
          }
        };
      }

      // Get user data
      const [userSkills, userInterests, idfMap] = await Promise.all([
        this.getUserSkillVector(userId),
        this.getUserInterests(userId),
        this.calculateSkillIDF()
      ]);

      // Score each project
      const scoredProjects = projects.map(project => {
        const projectSkills = this.parseProjectSkills(project);

        // Calculate similarity score (0-1)
        const skillSimilarity = this.calculateCosineSimilarity(
          userSkills,
          projectSkills,
          idfMap
        );

        // Calculate interest boost
        const { boost: interestBoost, matchCount: interestMatches } =
          this.calculateInterestBoost(project, userInterests);

        // Calculate search relevance (if search query provided)
        const { score: searchRelevance, matches: searchMatches, keywords } =
          this.calculateSearchRelevance(project, searchQuery);

        // Calculate other factors
        const recencyScore = this.calculateRecencyScore(project.createdAt);
        const engagementScore = this.calculateEngagementScore(project.stats);

        // Compute final score with search relevance
        // If search query exists, it becomes the primary factor (40% weight)
        let finalScore;
        if (hasSearchQuery) {
          finalScore = Math.min(
            (searchRelevance * 0.4) +      // Search relevance: 40%
            (skillSimilarity * 0.35) +     // Skill match: 35%
            (interestBoost * 0.5) +        // Interest boost: up to 10%
            (recencyScore * 0.5) +         // Recency: up to 5%
            (engagementScore * 0.5),       // Engagement: up to 7.5%
            1.0
          );
        } else {
          finalScore = Math.min(
            skillSimilarity + interestBoost + recencyScore + engagementScore,
            1.0
          );
        }

        // Calculate matching skills for display
        const matchingSkills = projectSkills.filter(skill =>
          Object.keys(userSkills).includes(skill)
        );

        return {
          ...project,
          matchScore: Math.round(finalScore * 100),
          matchDetails: {
            skillSimilarity: Math.round(skillSimilarity * 100),
            interestBoost: Math.round(interestBoost * 100),
            searchRelevance: hasSearchQuery ? Math.round(searchRelevance * 100) : null,
            searchMatches: hasSearchQuery ? searchMatches : null,
            searchKeywords: hasSearchQuery ? keywords : null,
            recencyBonus: Math.round(recencyScore * 100),
            engagementBonus: Math.round(engagementScore * 100),
            matchingSkills,
            matchingSkillCount: matchingSkills.length,
            totalRequiredSkills: projectSkills.length,
            interestMatches
          }
        };
      });

      // Filter and sort by score
      const filteredProjects = scoredProjects
        .filter(p => p.matchScore >= minScore * 100)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      return {
        matches: filteredProjects,
        meta: {
          totalProjects: projects.length,
          matchedProjects: filteredProjects.length,
          userSkillCount: Object.keys(userSkills).length,
          userInterestCount: Object.keys(userInterests).length,
          searchQuery: searchQuery || null,
          algorithm: hasSearchQuery ? 'skill-match-v2-search' : 'skill-match-v2',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error("Error in matching service:", error);
      throw errorThrower(500, "Error while computing project matches");
    }
  }

  /**
   * Find users that match a project's skill requirements
   */
  async getMatchedUsersForProject(projectId, options = {}) {
    const { limit = 10 } = options;

    try {
      // Get project details
      const projectSql = `SELECT * FROM "post" WHERE id = $1`;
      const projectResult = await pool.query(projectSql, [projectId]);

      if (projectResult.rows.length === 0) {
        throw errorThrower(404, "Project not found");
      }

      const project = projectResult.rows[0];
      const requiredSkills = this.parseProjectSkills(project);

      if (requiredSkills.length === 0) {
        return { matches: [], meta: { message: "No skills specified for project" } };
      }

      // Get all users with their skills (excluding project author and existing members)
      const usersSql = `
        SELECT u.id, u."fullName", u."email",
               COALESCE(
                   json_agg(
                       json_build_object(
                           'skillTitle', s."skillTitle",
                           'description', us."description",
                           'portfolio', us."portfolio"
                       )
                   ) FILTER (WHERE s.id IS NOT NULL),
                   '[]'::json
               ) AS skills
        FROM "user" u
        LEFT JOIN "userSkill" us ON u.id = us."userId"
        LEFT JOIN "skill" s ON us."skillId" = s.id
        WHERE u.id != $1
          AND u.id NOT IN (
              SELECT "userId" FROM "post_member" WHERE "projectId" = $2
          )
        GROUP BY u.id
      `;
      const usersResult = await pool.query(usersSql, [project.authorId, projectId]);

      // Score each user
      const scoredUsers = usersResult.rows.map(user => {
        const userSkills = user.skills
          .filter(s => s.skillTitle)
          .map(s => s.skillTitle.toLowerCase());

        const matchingSkills = requiredSkills.filter(skill =>
          userSkills.includes(skill)
        );

        const matchScore = requiredSkills.length > 0
          ? (matchingSkills.length / requiredSkills.length) * 100
          : 0;

        return {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          skills: user.skills,
          matchScore: Math.round(matchScore),
          matchingSkills,
          matchingSkillCount: matchingSkills.length
        };
      });

      // Sort and limit
      const topMatches = scoredUsers
        .filter(u => u.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      return {
        matches: topMatches,
        meta: {
          projectId,
          requiredSkills,
          totalCandidates: usersResult.rows.length,
          matchedCandidates: topMatches.length,
          algorithm: 'user-match-v1'
        }
      };
    } catch (error) {
      console.error("Error finding matched users:", error);
      throw error;
    }
  }
}

export default new MatchingService();
