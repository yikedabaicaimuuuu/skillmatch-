import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
import pool from "../configs/db.js";
import connectPgSimple from "connect-pg-simple";
const sessionSecrect = process.env.SESSION_SECRECT;
const pgSessionStore = connectPgSimple(session);

const sessionMiddleware = session({
  secret: sessionSecrect,
  store: new pgSessionStore({
    pool: pool,
    tableName: "session",
  }),
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    maxAge: 60 * 1000 * 60 * 24,
    // secure: true, // remove this line for local server
    // sameSite: "none", // remove this line for local server
    httpOnly: true,
  },
});
export default sessionMiddleware;
