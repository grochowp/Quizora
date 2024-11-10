import { ObjectId } from "mongoose";
import userRepository from "../repository/user.repository";
import quizRepository from "../repository/quiz.repository";
import quizDetailsRepository from "../repository/quizDetails.repository";

class ValidationService {
  async validateUser(userId: ObjectId) {
    const userExist = await userRepository.findUserById(userId);
    if (!userExist)
      throw new Error("Invalid data. User with this ID does not exist.");
  }

  async validateQuiz(quizId: ObjectId) {
    const quizExist = await quizRepository.findQuizById(quizId);
    if (!quizExist)
      throw new Error("Invalid data. Quiz with this ID does not exist.");
  }

  async validateQuizDetails(quizId: ObjectId) {
    const quizDetailsExist = await quizDetailsRepository.getQuizDetails(quizId);
    if (!quizDetailsExist)
      throw new Error("Invalid data. QuizDetails with this ID does not exist.");
  }

  isAuthorized(userId: ObjectId, ownerId: ObjectId, message: string) {
    const isSameId = userId.toString() === ownerId.toString();
    if (!isSameId) throw new Error(message);
  }
}

module.exports = new ValidationService();
