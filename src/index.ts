import * as dotenv from 'dotenv';
dotenv.config();
import express from "express"
const app = express()
import { URL } from 'url';
const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname;
import authRoutes from "./routes/auth.js"
import commentRoutes from "./routes/comments.js"
import likeRoutes from "./routes/likes.js"
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"
import relationshipRoutes from "./routes/relationships.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import multer from "multer"

interface MulterRequest extends Request {
  file: any;
}

//MIDDLEWARES
app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Credentials", 'true')
  next()
})
app.use(express.json())
app.use(cors({
  origin: "http://localhost:3000"
}))
app.use(cookieParser())
app.use(express.static( './public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })
const uploadCallback = (req: MulterRequest, res)=>{
  const file = req.file;
  res.status(200).json(file.filename)
}
app.post("/api/upload", upload.single("file"), uploadCallback)

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/relationships", relationshipRoutes)




app.listen(process.env.PORT, ()=>{
  console.log("Server is listening on port: ", process.env.PORT)
})