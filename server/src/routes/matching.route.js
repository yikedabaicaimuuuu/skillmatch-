import { Router } from "express";
import MatchingController from "../controllers/matching.controller.js";
import authMiddleware from "../middlewares/authenticate.middleware.js";

const matchingRouter = Router();

/**
 * @swagger
 * /api/matching/projects:
 *   post:
 *     summary: Get AI-matched projects for the authenticated user
 *     tags: [Matching]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: integer
 *                 default: 10
 *                 description: Maximum number of matches to return
 *               minScore:
 *                 type: number
 *                 default: 0.1
 *                 description: Minimum match score (0-1)
 *     responses:
 *       200:
 *         description: AI matching completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       matchScore:
 *                         type: integer
 *                       matchDetails:
 *                         type: object
 *                 meta:
 *                   type: object
 *       401:
 *         description: Authentication required
 */
matchingRouter.post("/projects", authMiddleware, MatchingController.getMatchedProjects);

/**
 * @swagger
 * /api/matching/users/{projectId}:
 *   get:
 *     summary: Get AI-matched users for a specific project
 *     tags: [Matching]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: User matching completed successfully
 *       404:
 *         description: Project not found
 */
matchingRouter.get("/users/:projectId", MatchingController.getMatchedUsersForProject);

/**
 * @swagger
 * /api/matching/explain/{projectId}:
 *   get:
 *     summary: Get detailed explanation of match score for a project
 *     tags: [Matching]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Match explanation retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Project not found
 */
matchingRouter.get("/explain/:projectId", authMiddleware, MatchingController.explainMatch);

export default matchingRouter;
