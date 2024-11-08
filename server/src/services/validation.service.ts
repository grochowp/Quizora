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

  isAuthorized(userId: ObjectId, ownerId: ObjectId): boolean {
    return userId.toString() === ownerId.toString();
  }
}

export default new ValidationService();
