import { db } from "../config/mySQLConnect.js"
import error from "../config/errors.js"
import jwt from "jsonwebtoken"
import { Express, Request, Response } from "express"
import { MysqlError  } from 'mysql'

export const getRelationships = (req: Request, res: Response)=>{

  const token = req.cookies.accessToken
  if(!token) return res.status(401).json({result: false, ...error(10004)})

  jwt.verify(token, "secretkey", (err, userInfo)=>{
    if(err) return res.status(403).json({result: false, ...error(10004)})
    const q = `SELECT followerUserId FROM relationships WHERE followedId=?`
    db.query(q, [req.params.userId], (err: MysqlError, data: any[])=>{
      if (err) return res.status(500).json(err)
      return res.status(200).json({result: true, content: data.map((relationship)=> relationship.followerUserId)})
    })
  })

}

export const addRelationship = (req: Request, res: Response) =>{
  const token = req.cookies.accessToken
  if(!token) return res.status(401).json({result: false, ...error(10004)})

  jwt.verify(token, "secretkey", (err, userInfo)=>{
    if(err) return res.status(403).json({result: false, ...error(10004)})

    const q = 'INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)'

    const values = [
      userInfo.id,
      req.params.userId
    ]

    db.query(q, [values], (err: MysqlError, data: any[])=>{
      if (err) return res.status(500).json({result: false, content: err})
      return res.status(200).json({result: true})
    })
  })
}

export const deleteRelationship = (req: Request, res: Response) =>{
  const token = req.cookies.accessToken
  if(!token) return res.status(401).json({result: false, ...error(10004)})

  jwt.verify(token, "secretkey", (err, userInfo)=>{
    if(err) return res.status(403).json({result: false, ...error(10004)})

    const q = 'DELETE FROM relationships WHERE followerUserId=? AND followedUserId=?'


    db.query(q, [userInfo.id, req.params.userId], (err: MysqlError, data: any[])=>{
      if (err) return res.status(500).json({result: false, content: err})
      return res.status(200).json({result: true})
    })
  })
}