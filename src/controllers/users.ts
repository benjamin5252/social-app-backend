import { db } from "../config/mySQLConnect.js";
import error from "../config/errors.js";
import { MysqlError } from "mysql";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).json({ result: false, ...error(10005) });

  const q = `SELECT * FROM users WHERE id=?`;
  db.query(q, [userId], (err: MysqlError, data: any[]) => {
    if (err) return res.status(500).json(err);
    if (data.length < 1)
      return res.status(404).json({ result: false, ...error(10002) });
    return res.status(200).json({ result: true, content: data[0] });
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ result: false, ...error(10004) });

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json({ result: false, ...error(10004) });

    const q =
      "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?";
    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err: MysqlError, data: any[] | any) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json({ result: true });
        return res.status(403).json({ result: false, ...error(10006) });
      }
    );
  });
};

export const searchUser = (req, res) => {
  const searchStr = req.params.searchStr;
  if (!searchStr)
    return res.status(400).json({ result: false, ...error(10005) });

  const q = "SELECT * FROM users WHERE username LIKE CONCAT('%', ?, '%')";
  db.query(q, [searchStr], (err: MysqlError, data: any[]) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ result: true, content: data });
  });
};
