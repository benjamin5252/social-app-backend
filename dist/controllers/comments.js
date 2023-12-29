import { db } from "../config/mySQLConnect.js";
import error from "../config/errors.js";
import jwt from "jsonwebtoken";
import moment from "moment";
export const getComments = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json({ result: false, ...error(10004) });
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err)
            return res.status(403).json({ result: false, ...error(10004) });
        const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId = ?  ORDER BY c.createdAt DESC`;
        db.query(q, [req.query.postId], (err, data) => {
            if (err)
                return res.status(500).json(err);
            return res.status(200).json({ result: true, content: data });
        });
    });
};
export const addComment = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json({ result: false, ...error(10004) });
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err)
            return res.status(403).json({ result: false, ...error(10004) });
        const q = 'INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?)';
        const values = [
            req.body.desc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId
        ];
        db.query(q, [values], (err, data) => {
            if (err)
                return res.status(500).json({ result: false, content: err });
            return res.status(200).json({ result: true });
        });
    });
};
//# sourceMappingURL=comments.js.map