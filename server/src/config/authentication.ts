const jwt = require("jsonwebtoken");

const generateToken = (id: Number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });
};

module.exports = { generateToken };
