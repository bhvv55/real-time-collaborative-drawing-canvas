import express from "express";
import { createServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import path from "node:path";

type Point = { x: number; y: number };
type Stroke = {
  id: string;
  userId: string;
  points: Point[];
  color: string;
  size: number;
};

type RoomState = {
  strokes: Stroke[];
  cursors: Record<string, { x: number; y: number; name: string; emoji: string }>;
};

const rooms = new Map<string, RoomState>();

function room(name: string): RoomState {
  if (!rooms.has(name)) rooms.set(name, { strokes: [], cursors: {} });
  return rooms.get(name)!;
}

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(process.cwd(), "public")));
app.get("/health", (_req, res) => res.json({ ok: true }));

wss.on("connection", (socket) => {
  let roomName = "";
  let userId = randomUUID();

  socket.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.type === "join") {
        roomName = String(msg.room || "cuddle-room").slice(0, 50);
        userId = String(msg.userId || userId);
        const state = room(roomName);

        state.cursors[userId] = {
          x: 0, y: 0,
          name: String(msg.name || "Puff"),
          emoji: String(msg.emoji || "🐻")
        };

        socket.send(JSON.stringify({ type: "snapshot", ...state }));
        broadcast(roomName, { type: "presence", cursors: state.cursors }, socket);
        return;
      }

      if (!roomName) return;
      const state = room(roomName);

      if (msg.type === "stroke") {
        const stroke: Stroke = {
          id: String(msg.id || randomUUID()),
          userId,
          points: Array.isArray(msg.points) ? msg.points : [],
          color: String(msg.color || "#6d5dfc"),
          size: Math.max(1, Number(msg.size || 6))
        };
        state.strokes.push(stroke);
        if (state.strokes.length > 3000) state.strokes.splice(0, 500);
        broadcast(roomName, { type: "stroke", stroke });
      }

      if (msg.type === "cursor") {
        const current = state.cursors[userId];
        if (!current) return;
        state.cursors[userId] = {
          ...current,
          x: Number(msg.x) || 0,
          y: Number(msg.y) || 0
        };
        broadcast(roomName, { type: "presence", cursors: state.cursors }, socket);
      }

      if (msg.type === "clear") {
        state.strokes = [];
        broadcast(roomName, { type: "clear" });
      }
    } catch {
      socket.send(JSON.stringify({ type: "error", message: "Invalid message" }));
    }
  });

  socket.on("close", () => {
    if (!roomName) return;
    const state = rooms.get(roomName);
    if (!state) return;
    delete state.cursors[userId];
    broadcast(roomName, { type: "presence", cursors: state.cursors });
  });
});

function broadcast(roomName: string, message: unknown, except?: WebSocket) {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client: any) => {
    if (client.readyState !== WebSocket.OPEN || client === except) return;
    if (client.roomName === roomName) client.send(payload);
  });
}

// Attach room metadata to sockets for efficient broadcasting.
wss.on("connection", (socket: any) => {
  socket.on("message", (raw: Buffer) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === "join") socket.roomName = String(msg.room || "cuddle-room").slice(0, 50);
    } catch {}
  });
});

server.listen(3000, () => {
  console.log("Cuddle Canvas → http://localhost:3000");
});