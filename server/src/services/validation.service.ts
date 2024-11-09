import { ObjectId } from "mongoose";
import userRepository from "../repository/user.repository";
import quizRepository from "../repository/quiz.repository";

class ValidationService {
  async validateUser(userId: ObjectId): Promise<void> {
    const userExist = await userRepository.findUserById(userId);
    if (!userExist)
      throw new Error("Invalid data. User with this ID does not exist.");
  }

  async validateQuiz(quizId: ObjectId): Promise<void> {
    const quizExist = await quizRepository.findQuizById(quizId);
    if (!quizExist)
      throw new Error("Invalid data. Quiz with this ID does not exist.");
  }

  isAuthorized(userId: ObjectId, ownerId: ObjectId, message: string) {
    const isSameId = userId.toString() === ownerId.toString();
    if (!isSameId) throw new Error(message);
  }
}

module.exports = new ValidationService();
