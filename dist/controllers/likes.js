import { db } from "../config/mySQLConnect.js";
import error from "../config/errors.js";
import jwt from "jsonwebtoken";
export const getLikes = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json({ result: false, ...error(10004) });
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err)
            return res.status(403).json({ result: false, ...error(10004) });
        const q = `SELECT userId FROM likes WHERE postId=?`;
        db.query(q, [req.params.postId], (err, data) => {
            if (err)
                return res.status(500).json(err);
            return res.status(200).json({ result: true, content: data.map((like) => like.userId) });
        });
    });
};
export const addLike = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json({ result: false, ...error(10004) });
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err)
            return res.status(403).json({ result: false, ...error(10004) });
        const q = 'INSERT INTO likes (`userId`, `postId`) VALUES (?)';
        const values = [
            userInfo.id,
            req.params.postId
        ];
        db.query(q, [values], (err, data) => {
            if (err)
                return res.status(500).json({ result: false, content: err });
            return res.status(200).json({ result: true });
        });
    });
};
export const deleteLike = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json({ result: false, ...error(10004) });
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err)
            return res.status(403).json({ result: false, ...error(10004) });
        const q = 'DELETE FROM likes WHERE userId=? AND postId=?';
        db.query(q, [userInfo.id, req.params.postId], (err, data) => {
            if (err)
                return res.status(500).json({ result: false, content: err });
            return res.status(200).json({ result: true });
        });
    });
};
//# sourceMappingURL=likes.js.map