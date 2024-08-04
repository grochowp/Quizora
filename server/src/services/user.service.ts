const User = require("../models/user.model");
const generateToken = require("../config/auth");
const bcrypt = require("bcrypt");

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

class UserService {
  async registerUser(login: string, email: string, password: string) {
    const userExist = await User.findOne({ login });

    if (userExist) throw new Error("User already exists");

    if (password.length > 8)
      throw new Error("Password must be at least 8 characters long");

    if (!passwordRegex.test(password))
      throw new Error(
        "Password must be at least 8 characters long and include at least one letter and one digit."
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      login,
      email,
      password: hashedPassword,
      points: 0,
      profilePicture: process.env.DEFAULT_PROFILE_PICTURE,
      createdAt: new Date(),
      createdQuizzes: [],
    });

    if (!user) throw new Error("Invalid user data");

    delete user.password;

    return {
      ...user,
      token: generateToken(user._id),
    };
  }

  async loginUser(login: string, password: string) {
    const user = await User.findOne({ login });
    if (!user) throw new Error("Invalid login or password");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new Error("Invalid login or password");

    delete user.password;

    return {
      ...user,
      token: generateToken(user._id),
    };
  }

  async logoutUser() {}

  async editUser(login: string) {}

  async editProfilePicture(login: string) {}
}

module.exports = new UserService();
