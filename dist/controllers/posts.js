import { db } from "../config/mySQLConnect.js";
import error from "../config/errors.js";
import jwt from "jsonwebtoken";
import moment from "moment";
export const getPosts = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json({ result: false, ...error(10004) });
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err)
            return res.status(403).json({ result: false, ...error(10004) });
        const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId=? OR p.userId=? ORDER BY p.createdAt DESC`;
        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if (err)
                return res.status(500).json(err);
            return res.status(200).json({ result: true, content: data });
        });
    });
};
export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json({ result: false, ...error(10004) });
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err)
            return res.status(403).json({ result: false, ...error(10004) });
        const q = 'INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)';
        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ];
        db.query(q, [values], (err, data) => {
            if (err)
                return res.status(500).json({ result: false, content: err });
            return res.status(200).json({ result: true });
        });
    });
};
//# sourceMappingURL=posts.js.map