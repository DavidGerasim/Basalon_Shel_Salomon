const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Generate a token for a user
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Verify the token and return the user ID
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(403).send("Token is required!");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid Token!");
    req.userId = decoded.id;
    next();
  });
};

module.exports = { generateToken, verifyToken };
