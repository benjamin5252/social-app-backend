import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import { URL } from "url";
const __filename = new URL("", import.meta.url).pathname;
const __dirname = new URL(".", import.meta.url).pathname;
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import relationshipRoutes from "./routes/relationships.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import * as fs from "fs";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { MyWebSocket } from "./libs/interface.js";
import timeout from "connect-timeout";
import {
  wsLogin,
  wsUpdateFriendList,
  wsOnClose,
  wsSendChatMessage,
  swSetOnlineUserBroadcast,
} from "./libs/websocket.js";

interface MulterRequest extends Request {
  file: any;
}

app.get("/", (req, res) => {
  res.send("Social app backend v1.0.1");
}); // put this before cors to let browser see

// connection timeout
app.use(timeout(12000));

//MIDDLEWARES
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(express.json());
app.use(express.static("./public")); // add this middleware before allowedOrigins

const allowedOrigins = [
  "http://localhost:3000",
  "https://benjamin5252.github.io",
  "https://social.yinte.cloud",
  "http://social.yinte.cloud",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (origin) {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));
// app.use(cors());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/relationships", relationshipRoutes);

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const dir = "./public/upload";
    const dir1 = "./public";
    if (!fs.existsSync(dir1)) {
      fs.mkdirSync(dir1);
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const uploadCallback = (req: MulterRequest, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
};
app.post("/api/upload", upload.single("file"), uploadCallback);

const server = http.createServer(app);
const wss = new WebSocketServer({ server: server });

swSetOnlineUserBroadcast(wss);

wss.on("connection", function connection(ws: MyWebSocket) {
  ws.send("Welcome New Client!");

  ws.on("message", (message: string) => {
    try {
      const msgObj = JSON.parse(message);

      switch (msgObj.method) {
        case "login":
          wsLogin(wss, ws, msgObj);
          break;
        case "updateFriendList":
          wsUpdateFriendList(wss, ws, msgObj);
          break;
        case "sendChatMessage":
          wsSendChatMessage(wss, ws, msgObj);
          break;
      }
    } catch (error) {
      console.error("Error parsing JSON");
    }
  });

  ws.on("close", () => {
    wsOnClose(wss, ws);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server is listening on port: ", process.env.PORT);
});
