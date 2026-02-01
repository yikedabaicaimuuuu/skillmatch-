import pool from "../configs/db.js";
import errorThrower from "../helper/errorThrower.js";

class PostModel {
    #params = [];
    #sql = "";

    async createPost(authorId, title, skills, description, imageUrl, stats) {
        try {
            if (typeof stats !== 'object' || stats === null) {
                throw new Error("Invalid stats object");
            }
            
            const statsJSON = JSON.stringify(stats);
            
            this.#sql = `
                INSERT INTO "post" ("authorId", "title", "skills", "description", "imageUrl", "stats")
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
            `;
            
            this.#params = [authorId, title, skills, description, imageUrl, statsJSON];
            console.log('----->' + this.#params);
            
            const result = await pool.query(this.#sql, this.#params);
            console.log(result.rows[0]);
            
            return result.rows[0];
        } catch (error) {
            console.error('Error:', error.message);
            throw errorThrower(400, "Error while creating a post");
        }
    }
    

    async getPostByAuthorId(authorId) {
        try {
            this.#sql = `
                SELECT p.*, 
                       COALESCE(
                           json_agg(
                               json_build_object(
                                   'userId', pm."userId",
                                   'name', u."fullName",
                                   'email', u."email",
                                   'role', pm."role",
                                   'status', pm."status",
                                   'joinedAt', pm."joinedAt"
                               )
                           ) FILTER (WHERE pm."userId" IS NOT NULL), 
                           '[]'::json
                       ) AS members
                FROM "post" p
                LEFT JOIN "post_member" pm ON p.id = pm."projectId"
                LEFT JOIN "user" u ON pm."userId" = u.id
                WHERE p."authorId" = $1
                GROUP BY p.id
                ORDER BY p."createdAt" DESC
            `;
            this.#params = [authorId];
            const result = await pool.query(this.#sql, this.#params);
            return result.rows;
        } catch (error) {
            throw errorThrower(400, "Error while retrieving posts by author ID");
        }
    }

    async getPostById(postId) {
        try {
            this.#sql = `
                SELECT p.*, 
                       COALESCE(
                           json_agg(
                               json_build_object(
                                   'userId', pm."userId",
                                   'name', u."fullName",
                                   'email', u."email",
                                   'role', pm."role",
                                   'status', pm."status",
                                   'joinedAt', pm."joinedAt"
                               )
                           ) FILTER (WHERE pm."userId" IS NOT NULL), 
                           '[]'::json
                       ) AS members
                FROM "post" p
                LEFT JOIN "post_member" pm ON p.id = pm."projectId"
                LEFT JOIN "user" u ON pm."userId" = u.id
                WHERE p.id = $1
                GROUP BY p.id
            `;
            this.#params = [postId];
            const result = await pool.query(this.#sql, this.#params);
    
            if (result.rows.length === 0) {
                throw errorThrower(404, "Post not found");
            }
    
            return result.rows[0];
        } catch (error) {
            throw errorThrower(400, "Error while retrieving post by ID");
        }
    }

    async getAllPosts() {
        try {
            this.#sql = `
                SELECT p.*, 
                       COALESCE(
                           json_agg(
                               json_build_object(
                                   'userId', pm."userId",
                                   'name', u."fullName",
                                   'email', u."email",
                                   'role', pm."role",
                                   'status', pm."status",
                                   'joinedAt', pm."joinedAt"
                               )
                           ) FILTER (WHERE pm."userId" IS NOT NULL), 
                           '[]'::json
                       ) AS members
                FROM "post" p
                LEFT JOIN "post_member" pm ON p.id = pm."projectId"
                LEFT JOIN "user" u ON pm."userId" = u.id
                GROUP BY p.id
                ORDER BY p."createdAt" DESC
            `;
            const result = await pool.query(this.#sql);
            return result.rows;
        } catch (error) {
            throw errorThrower(400, "Error while retrieving all posts");
        }
    }

    async updatePost(postId, title, skills, description, imageUrl, stats) {
        try {
            this.#sql = `
                UPDATE "post"
                SET "title" = $1,
                    "skills" = $2,
                    "description" = $3,
                    "imageUrl" = $4,
                    "stats" = $5,
                    "updatedAt" = NOW()
                WHERE "id" = $6
                RETURNING *;
            `;
            this.#params = [title, skills, description, imageUrl, stats, postId];
            const result = await pool.query(this.#sql, this.#params);
            return result.rows[0];
        } catch (error) {
            throw errorThrower(400, "Error while updating the post");
        }
    }

    async updateStats(postId, { views, likes }) {
        try {
          this.#sql = `
            UPDATE "post"
            SET "stats" = json_build_object('views', $1, 'likes', $2),
                "updatedAt" = NOW()
            WHERE "id" = $3
            RETURNING *;
          `;
          
          this.#params = [views, likes, postId];
          
          const result = await pool.query(this.#sql, this.#params);
      
          if (result.rows.length === 0) {
            throw new Error("Post not found");
          }
      
          return result.rows[0];
        } catch (error) {
          throw errorThrower(400, "Error while updating post stats - Test");
        }
      }
      

    async deletePost(postId) {
        try {
            this.#sql = `DELETE FROM "post" WHERE "id" = $1 RETURNING *`;
            this.#params = [postId];
            const result = await pool.query(this.#sql, this.#params);
            return result.rows[0];
        } catch (error) {
            throw errorThrower(400, "Error while deleting the post");
        }
    }

    async addMemberToProject(projectId, userId, role = 'member') {
        try {
            this.#sql = `
                INSERT INTO "post_member" ("projectId", "userId", "role")
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            this.#params = [projectId, userId, role];
            const result = await pool.query(this.#sql, this.#params);
            return result.rows[0];
        } catch (error) {
            throw errorThrower(400, "Error while adding member to the project");
        }
    }

    async removeMemberFromProject(projectId, userId) {
        try {
            this.#sql = `
                DELETE FROM "post_member"
                WHERE "projectId" = $1 AND "userId" = $2
                RETURNING *;
            `;
            this.#params = [projectId, userId];
            const result = await pool.query(this.#sql, this.#params);
            
            if (result.rows.length === 0) {
                throw new Error("Member not found in the project");
            }
            
            return result.rows[0];
        } catch (error) {
            throw errorThrower(400, "Error while removing member from the project");
        }
    }

    async updateMemberInProject(projectId, userId, { role, status }) {
        try {
            this.#sql = `
                UPDATE "post_member"
                SET "role" = COALESCE($1, "role"),
                    "status" = COALESCE($2, "status"),
                    "updatedAt" = NOW()
                WHERE "projectId" = $3 AND "userId" = $4
                RETURNING *;
            `;
            this.#params = [role, status, projectId, userId];
            const result = await pool.query(this.#sql, this.#params);
            
            if (result.rows.length === 0) {
                throw new Error("Member not found in the project");
            }

            return result.rows[0];
        } catch (error) {
            throw errorThrower(400, "Error while updating member in the project");
        }
    }
}

export default new PostModel();
