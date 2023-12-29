import { db } from "../config/mySQLConnect.js"
import error from "../config/errors.js"
import { MysqlError } from "mysql"

export const getUser = (req, res)=>{

  const userId = req.params.userId
  if(!userId) return res.status(400).json({result: false, ...error(10005)})
  
  const q = `SELECT * FROM users WHERE id=?`
  db.query(q, [userId], (err: MysqlError, data: any[])=>{
    if (err) return res.status(500).json(err)
    if (data.length < 1) return res.status(404).json({result: false, ...error(10002)})
    return res.status(200).json({result: true, content: data[0]})
  })
  

}

