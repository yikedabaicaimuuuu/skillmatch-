// model folder is responsible for interacting directly with the database

import pool from "../configs/db.js";
import errorThrower from "../helper/errorThrower.js";

class UserModel {
  #params = [];
  #sql = "";

  async createUser(fullName, email, password) {
    try {
      this.#sql = `INSERT INTO "user" ("fullName", "email", "password") VALUES ($1, $2, $3) RETURNING *`;
      this.#params = [fullName, email, password];
      const result = await pool.query(this.#sql, this.#params);
      return result.rows[0];
    } catch (error) {
      errorThrower(400, "Error when creating user");
    }
  }

  async getUserByEmail(email) {
    this.#sql = `SELECT * FROM "user" WHERE "email" = $1`;
    this.#params = [email];

    try {
      const result = await pool.query(this.#sql, this.#params);
      return result.rows[0];
    } catch (error) {
      throw errorThrower(400, "Error when getting user by email");
    }
  }

  async updatePassword(hashedPassword, userId) {
    this.#sql = `UPDATE "user" SET password = $1 WHERE id = $2 RETURNING *`;
    this.#params = [hashedPassword, userId];

    try {
      const result = await pool.query(this.#sql, this.#params);
      return result.rows[0];
    } catch (error) {
      throw errorThrower(400, "Error when updating password ");
    }
  }

  async getUserById(userId) {
    try {
      this.#sql = `SELECT * FROM "user" WHERE "id" = $1`;
      this.#params = [userId];
      const result = await pool.query(this.#sql, this.#params);
      return result.rows[0];
    } catch (error) {
      throw errorThrower(400, "Error when getting user by id");
    }
  }

  async getAllSkill() {
    try {
      this.#sql = `SELECT * FROM "skill"`;
      this.#params = [];
      const result = await pool.query(this.#sql, this.#params);
      return result.rows;
    } catch (error) {
      throw errorThrower(400, "Error when getting all skill");
    }
  }
  async getUserSkill(userId) {
    try {
      this.#sql = `
    SELECT "skill"."id" as "skillId", "userSkill"."id", "userSkill"."description", "userSkill"."portfolio", "skill"."skillTitle"
FROM "userSkill"
INNER JOIN "skill" ON "skill"."id" = "userSkill"."skillId"
WHERE "userSkill"."userId" = $1;


    `;
      this.#params = [userId];
      const result = await pool.query(this.#sql, this.#params);
      return result.rows;
    } catch (error) {
      console.log(error);
      throw errorThrower(400, "Error when getting user skill");
    }
  }

  async getUserInterest(userId) {
    try {
      this.#sql = `
        SELECT "interest"."id" as "interestId", "userInterest"."id", "userInterest"."description", "userInterest"."interestLevel", "interest"."interestTitle"
        FROM "userInterest"
        INNER JOIN "interest" ON "interest"."id" = "userInterest"."interestId"
        WHERE "userInterest"."userId" = $1;
      `;
      this.#params = [userId];
      const result = await pool.query(this.#sql, this.#params);
      return result.rows;
    } catch (error) {
      console.log(error);
      throw errorThrower(400, "Error when getting user interest");
    }
  }

  async addUserSkill(userId, skillTitle, description, portfolio) {
    console.log(userId, skillTitle, description, portfolio);
    try {
      this.#sql = `
      INSERT INTO "userSkill"("userId", "skillId", "description", "portfolio")
      VALUES ($1, (SELECT "id" FROM "skill" WHERE "skillTitle" = $2), $3, $4)
      RETURNING *;
    `;
      this.#params = [userId, skillTitle, description, portfolio];
      const result = await pool.query(this.#sql, this.#params);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw errorThrower(400, "Error when adding skill");
    }
  }

  async removeUserSkill(userId, id) {
    try {
      this.#sql = `
      DELETE FROM "userSkill"
      WHERE "userId" = $1 AND "skillId" = $2
      RETURNING *;
    `;
      this.#params = [userId, id];
      const result = await pool.query(this.#sql, this.#params);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw errorThrower(400, "Error when removing user skill");
    }
  }

  async getAllInterest() {
    try {
      this.#sql = `SELECT * FROM "interest"`;
      this.#params = [];
      const result = await pool.query(this.#sql, this.#params);
      return result.rows;
    } catch (error) {
      throw errorThrower(400, "Error when getting all interest");
    }
  }

  async addUserInterest(userId, interestTitle, description, interestLevel) {
    try {
      this.#sql = `
      INSERT INTO "userInterest"("userId", "interestId", "description", "interestLevel")
      VALUES ($1, (SELECT "id" FROM "interest" WHERE "interestTitle" = $2 LIMIT $5), $3, $4)
      RETURNING *;
    `;
      const limit = 1;
      this.#params = [userId, interestTitle, description, interestLevel, limit];
      const result = await pool.query(this.#sql, this.#params);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw errorThrower(400, "Error when adding interest");
    }
  }

  async removeUserInterest(userId, interestId) {
    try {
      this.#sql = `
      DELETE FROM "userInterest"
      WHERE "userId" = $1 AND "interestId" = $2
      RETURNING *;
    `;
      this.#params = [userId, interestId];
      const result = await pool.query(this.#sql, this.#params);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw errorThrower(400, "Error when removing user skill");
    }
  }
}

export default new UserModel();
