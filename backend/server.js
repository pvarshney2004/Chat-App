import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app); // bcz socket.io requires an HTTP server

// Initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" }
})

// Store online users
export const userSocketMap = {}; // {userId: socketId}

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);
  if (userId) userSocketMap[userId] = socket.id
  // Emit online user to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})

//middleware
app.use(cors());
app.use(express.json({ limit: '4mb' }));
app.use('/api/status', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

// Connect to the database
await connectDB();

// Start the server

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// export server for Vercel
export default server;