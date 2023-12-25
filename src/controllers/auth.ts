import { db } from "../connect.js"
import bcrypt from "bcryptjs"
import error from "../config/errors.js"

export const register = (req, res)=>{
  
  //CHECK USER IF EXITS

  const q = "SELECT * FROM users WHERE username = ?"
  
  db.query(q, [req.body.username], (err,data)=>{
    if(err) return res.status(500).json({result: false, ...error(0)})
    if(data.length) return res.status(409).json({result: false, ...error(10001)})
    //CREATE A NEW USER
    //HASH THE PASSWORD
    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(req.body.password, salt)

    const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)"
    const values = [req.body.username, req.body.email, hashPassword, req.body.name]
    db.query(q, [values], (err, data)=>{
      if(err) return res.status(500).json(err)
      return res.status(200).json({result: true})
    })
  })

  

}

export const login = (req, res)=>{
  const q = "SELECT * FROM users WHERE username = ?"

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err)
    
    if (data.length === 0) return res.status(404).json({result: false, ...error(10002)})

    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)

    if(!checkPassword) return res.status(400).json({result: false, ...error(10003)})
  })
}

export const logout = (req, res)=>{
  
}