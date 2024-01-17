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
import * as fs from 'fs';
import http from "http"
import WebSocket, { WebSocketServer } from 'ws'

interface MulterRequest extends Request {
  file: any;
}

interface MyWebSocket extends WebSocket {
  userId?: number,
  friendList?: number[]
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
  destination: async function (req, file, cb) {
    const dir = './public/upload'
    const dir1 = './public'
    if (!fs.existsSync(dir1)){
        fs.mkdirSync(dir1);
        fs.mkdirSync(dir);
    }
    cb(null, dir)
    
    
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


const server = http.createServer(app)
const wss = new WebSocketServer({ server:server });

// setInterval(()=>{
//   const broadCastOnlineUser = (ws: MyWebSocket)=>{
//     if(ws.friendList && ws.friendList.length > 0){
      
//       const getCommonItems = (set: Set<MyWebSocket>, array: number[]) => {
//           const arrayFromSet = Array.from(set)
          
//           return arrayFromSet.filter(item => array.includes(item.userId)).map(item=>item.userId);
//       }
//       const commonItems = getCommonItems(wss.clients, ws.friendList)
//       ws.send(JSON.stringify({ result: true, reply: "getOnlineUsers", onlineFriendList: commonItems }));
//     }
//   }

//   for(const wsItem of wss.clients){
//     broadCastOnlineUser(wsItem)
//   }
// }, 5000)


wss.on('connection', function connection(ws: MyWebSocket) {
  console.log('A new client Connected!');
  ws.send('Welcome New Client!');
  
  

  // Handle incoming messages
    ws.on('message', (message: string) => {
        console.log(`Received: ${message}`);

        // Parse JSON data
        try {
            const jsonData = JSON.parse(message);
            console.log('Parsed JSON:', jsonData);

            if(jsonData.method === 'login'){
              if(jsonData.userId) ws.userId = jsonData.userId
              
              ws.send(JSON.stringify({ result: true,  reply:"login" }));

              const broadCastOnlineUser = (ws: MyWebSocket)=>{
                if(ws.friendList && ws.friendList.length > 0 && ws.friendList.includes(jsonData.userId)){
                  
                  const getCommonItems = (set: Set<MyWebSocket>, array: number[]) => {
                      const arrayFromSet = Array.from(set)
                      
                      return arrayFromSet.filter(item => array.includes(item.userId)).map(item=>item.userId);
                  }
                  const commonItems = getCommonItems(wss.clients, ws.friendList)
                  ws.send(JSON.stringify({ result: true, reply: "getOnlineUsers", onlineFriendList: commonItems }));
                }
              }
            
              for(const wsItem of wss.clients){
                  broadCastOnlineUser(wsItem)
              }
            }

            if(jsonData.method === 'getOnlineUserList'){
              if(jsonData.friendList) ws.friendList = jsonData.friendList
              const getCommonItems = (set: Set<MyWebSocket>, array: number[]) => {
                  const arrayFromSet = Array.from(set)
                 
                  return arrayFromSet.filter(item => array.includes(item.userId)).map(item=>item.userId);
              }
              const commonItems = getCommonItems(wss.clients, jsonData.friendList)
              
              ws.send(JSON.stringify({ result: true, reply: "getOnlineUsers", onlineFriendList: commonItems }));

              
            }

            
        } catch (error) {
            console.error('Error parsing JSON');

           
     
        }
    });

    // Handle WebSocket connection closure
    ws.on('close', () => {
        console.log('Client disconnected');
        const userId = ws.userId
        const broadCastOnlineUser = (ws: MyWebSocket)=>{
          if(ws.friendList && userId && ws.friendList.length > 0 && ws.friendList.includes(userId)){
            
            const getCommonItems = (set: Set<MyWebSocket>, array: number[]) => {
                const arrayFromSet = Array.from(set)
                
                return arrayFromSet.filter(item => array.includes(item.userId)).map(item=>item.userId);
            }
            const commonItems = getCommonItems(wss.clients, ws.friendList)
            ws.send(JSON.stringify({ result: true, reply: "getOnlineUsers", onlineFriendList: commonItems }));
          }
        }
      
        for(const wsItem of wss.clients){
            broadCastOnlineUser(wsItem)
        }
    });
});

server.listen(process.env.PORT, ()=>{
  console.log("Server is listening on port: ", process.env.PORT)
})


