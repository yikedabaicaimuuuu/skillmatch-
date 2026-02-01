import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const corsOptions = {
  origin: true, // Allows all origins
  methods: "PUT,GET,POST,DELETE",
  credentials: true,
};

const corsMiddleware = cors(corsOptions);
export default corsMiddleware;