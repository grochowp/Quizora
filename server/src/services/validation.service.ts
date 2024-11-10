import { ClientSession, ObjectId } from "mongoose";
import userRepository from "../repository/user.repository";
import quizRepository from "../repository/quiz.repository";
import quizDetailsRepository from "../repository/quizDetails.repository";
import { IQuiz } from "../models/quiz.model";
import { IUser } from "../models/user.model";
import { IQuizDetails } from "../models/quizDetails.model";

class ValidationService {
  async validateUser(
    userId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IUser> {
    const userExist = await userRepository.findUserById(userId, options);
    if (!userExist)
      throw new Error("Invalid data. User with this ID does not exist.");
    return userExist;
  }

  async validateQuiz(
    quizId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IQuiz> {
    const quizExist = await quizRepository.findQuizById(quizId, options);
    if (!quizExist)
      throw new Error("Invalid data. Quiz with this ID does not exist.");
    return quizExist;
  }

  async validateQuizDetails(
    quizId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IQuizDetails> {
    const quizDetailsExist = await quizDetailsRepository.getQuizDetails(
      quizId,
      options
    );
    if (!quizDetailsExist)
      throw new Error("Invalid data. QuizDetails with this ID does not exist.");
    return quizDetailsExist;
  }

  isAuthorized(userId: ObjectId, ownerId: ObjectId, message: string) {
    const isSameId = userId.toString() === ownerId.toString();
    if (!isSameId) throw new Error(message);
  }
}

module.exports = new ValidationService();
