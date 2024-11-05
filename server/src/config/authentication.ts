const jwt = require("jsonwebtoken");

const generateToken = (id: Number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // TO-DO: change to 1h or 3h before deploy
  });
};

module.exports = { generateToken };
