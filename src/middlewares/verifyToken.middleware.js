import jwt from "jsonwebtoken";

//verify token
const verifyToken = (req, res, next) => {
  // 1. Get the  "Bearer <token>"
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!"); // 403 Forbidden
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!"); // 401 Unauthorized
  }
};

// Middleware to check if the user is authorized (can be reused for updates/deletes)
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log("role of admin", req.user.role);

    if (req.user.id === req.params.userId || req.user.role === "admin") {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

// Middleware to check if the user is an Admin (for product creation/updates)
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      console.log("role of admin", req.user.role);

      next();
    } else {
      console.log("role of admin", req.user.role);
      res
        .status(403)
        .json("You must be an Administrator to perform this action!");
    }
  });
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };