import { jwt } from 'jsonwebtoken';

const jwt = jwt();


function verifyAdmin(req, res, next) {
    const token = req.headers.token;

    if (!token) return res.status(401).json("Access denied!");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json("Token invalid!");

        if (!user.isAdmin) {
            return res.status(403).json("You are not allowed!");
        }

        req.user = user;
        next();
    });
}

module.exports = verifyAdmin;