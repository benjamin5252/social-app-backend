import { db } from "../config/mySQLConnect.js"
import error from "../config/errors.js"
import { MysqlError  } from 'mysql'
import { Express, Request, Response } from "express"
import jwt from "jsonwebtoken"
import moment from "moment"

export const getPosts = (req: Request, res: Response)=>{
  const userId = req.query.userId;
  const token = req.cookies.accessToken
  if(!token) return res.status(401).json({result: false, ...error(10004)})

  jwt.verify(token, "secretkey", (err, userInfo)=>{
    if(err) return res.status(403).json({result: false, ...error(10004)})

    const q = userId ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC` 
    : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId=? OR p.userId=? ORDER BY p.createdAt DESC`
    

    db.query(q, userId? [userId] :  [userInfo.id, userInfo.id], (err: MysqlError, data: any[])=>{
      if (err) return res.status(500).json(err)
      return res.status(200).json({result: true, content: data})
    })
  })

  
}

export const addPost = (req: Request, res: Response)=>{
  const token = req.cookies.accessToken
  if(!token) return res.status(401).json({result: false, ...error(10004)})

  jwt.verify(token, "secretkey", (err, userInfo)=>{
    if(err) return res.status(403).json({result: false, ...error(10004)})

    const q = 'INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)'

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id
    ]

    db.query(q, [values], (err: MysqlError, data: any[])=>{
      if (err) return res.status(500).json({result: false, content: err})
      return res.status(200).json({result: true})
    })
  })
}

export const deletePost = (req: Request, res: Response)=>{
  const token = req.cookies.accessToken
  if(!token) return res.status(401).json({result: false, ...error(10004)})

  jwt.verify(token, "secretkey", (err, userInfo)=>{
    if(err) return res.status(403).json({result: false, ...error(10004)})

    const q = 'DELETE FROM posts WHERE id=? AND userId=?'

    db.query(q, [req.params.id, userInfo.id], (err: MysqlError, data: any[] | any)=>{
      if (err) return res.status(500).json({result: false, content: err})
      if(data.affectedRows > 0) return res.status(200).json({result: true})
      return res.status(403).json({result: false, ...error(10006)})
    })
  })
}
