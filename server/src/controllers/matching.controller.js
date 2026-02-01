/**
 * AI Matching Controller
 * Handles requests for AI-powered skill matching
 */

import MatchingService from "../services/matching.service.js";
import errorThrower from "../helper/errorThrower.js";

class MatchingController {
  /**
   * Get AI-matched projects for the authenticated user
   * POST /api/matching/projects
   */
  async getMatchedProjects(request, response, next) {
    try {
      const userId = request.session?.userId;

      if (!userId) {
        throw errorThrower(401, "Authentication required");
      }

      const { limit = 10, minScore = 0.1 } = request.body;

      const result = await MatchingService.getMatchedProjects(userId, {
        limit: Math.min(limit, 50), // Cap at 50
        minScore
      });

      response.status(200).json({
        status: "success",
        message: "AI matching completed successfully",
        data: result.matches,
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get AI-matched users for a specific project
   * GET /api/matching/users/:projectId
   */
  async getMatchedUsersForProject(request, response, next) {
    try {
      const { projectId } = request.params;
      const { limit = 10 } = request.query;

      if (!projectId) {
        throw errorThrower(400, "Project ID is required");
      }

      const result = await MatchingService.getMatchedUsersForProject(
        parseInt(projectId),
        { limit: Math.min(parseInt(limit), 50) }
      );

      response.status(200).json({
        status: "success",
        message: "User matching completed successfully",
        data: result.matches,
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get matching explanation for a specific project
   * GET /api/matching/explain/:projectId
   */
  async explainMatch(request, response, next) {
    try {
      const userId = request.session?.userId;
      const { projectId } = request.params;

      if (!userId) {
        throw errorThrower(401, "Authentication required");
      }

      // Get detailed match for single project
      const result = await MatchingService.getMatchedProjects(userId, {
        limit: 100,
        minScore: 0
      });

      const projectMatch = result.matches.find(
        p => p.id === parseInt(projectId)
      );

      if (!projectMatch) {
        throw errorThrower(404, "Project not found or no match data available");
      }

      response.status(200).json({
        status: "success",
        data: {
          projectId: projectMatch.id,
          title: projectMatch.title,
          matchScore: projectMatch.matchScore,
          explanation: {
            skillMatch: `${projectMatch.matchDetails.matchingSkillCount} of ${projectMatch.matchDetails.totalRequiredSkills} required skills match your profile`,
            skillSimilarity: `${projectMatch.matchDetails.skillSimilarity}% skill similarity score`,
            interestBoost: projectMatch.matchDetails.interestBoost > 0
              ? `+${projectMatch.matchDetails.interestBoost}% boost from ${projectMatch.matchDetails.interestMatches} matching interests`
              : "No interest boost applied",
            recencyBonus: `+${projectMatch.matchDetails.recencyBonus}% recency bonus`,
            engagementBonus: `+${projectMatch.matchDetails.engagementBonus}% engagement bonus`,
            matchingSkills: projectMatch.matchDetails.matchingSkills
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MatchingController();
