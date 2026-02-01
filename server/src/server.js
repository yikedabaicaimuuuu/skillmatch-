import { createServer } from "http";
import app from "./app.js";
import swaggerDocs from "./swagger.js";
import SocketService from "./services/socket.service.js";
import sessionMiddleware from "./middlewares/session.middleware.js";
import MessageModel from "./models/message.model.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.io with session middleware
    SocketService.initialize(httpServer, sessionMiddleware);

    // Initialize message table
    await MessageModel.createTable();

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`App is running on http://localhost:${PORT}`);
      console.log(`WebSocket server is running on ws://localhost:${PORT}`);
      swaggerDocs(app, PORT);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
