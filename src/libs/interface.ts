import WebSocket, { WebSocketServer } from 'ws'

export interface MyWebSocket extends WebSocket {
  userId?: number,
  friendList?: number[]
}

