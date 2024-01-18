import WebSocket, { WebSocketServer } from 'ws'
import { MyWebSocket } from './interface.js';

export const wsSendChatMessage = (wss: WebSocketServer, ws: MyWebSocket, msgObj: {message?: string, to?: number})=>{
  if(msgObj.message && msgObj.to){
    for(const client of wss.clients){
      // @ts-ignore
      if(client.userId === msgObj.to){
        client.send(JSON.stringify({...msgObj, result: true, reply: "sendChatMessage", message: msgObj.message}))
      }
    }
  }
}

export const wsLogin = (wss: WebSocketServer, ws: MyWebSocket, msgObj: {userId?: number})=>{
  if(msgObj.userId) ws.userId = msgObj.userId
              
    ws.send(JSON.stringify({ result: true,  reply:"login" }));

    const broadCastOnlineUser = (ws: MyWebSocket)=>{
      if(ws.friendList && ws.friendList.length > 0 && ws.friendList.includes(msgObj.userId)){
        
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

export const wsUpdateFriendList = (wss: WebSocketServer, ws: MyWebSocket, msgObj: {friendList?: number[]})=>{
  if(msgObj.friendList) ws.friendList = msgObj.friendList
    const getCommonItems = (set: Set<MyWebSocket>, array: number[]) => {
        const arrayFromSet = Array.from(set)
        
        return arrayFromSet.filter(item => array.includes(item.userId)).map(item=>item.userId);
    }
    const commonItems = getCommonItems(wss.clients, msgObj.friendList)
    
    ws.send(JSON.stringify({ result: true, reply: "getOnlineUsers", onlineFriendList: commonItems }));
}

export const wsOnClose = (wss: WebSocketServer, ws: MyWebSocket)=>{
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
}

export const swSetOnlineUserBroadcast =(wss: WebSocketServer)=>{
  setInterval(()=>{
    const broadCastOnlineUser = (ws: MyWebSocket)=>{
      if(ws.friendList && ws.friendList.length > 0){
        
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
  }, 5000)
}
