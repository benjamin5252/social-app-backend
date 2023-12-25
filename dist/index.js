import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comment.js";
import likeRoutes from "./routes/like.js";
import postRoutes from "./routes/post.js";
import userRoutes from "./routes/user.js";
//MIDDLEWARES
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/auth", authRoutes);
app.listen(process.env.PORT, () => {
    console.log("Server is listening on port: ", process.env.PORT);
});
//# sourceMappingURL=index.js.map