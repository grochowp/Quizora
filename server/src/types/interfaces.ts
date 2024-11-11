import { IQuiz } from "../models/quiz.model";
import { IUser } from "../models/user.model";

export interface UserTokenRequest extends Request {
  user: IUser;
}

export interface IQuizWithQuestions extends IQuiz {
  questions?: number;
}

export interface QuizFilters {
  userId?: string;
  difficulty?: string;
  category?: string;
  title?: string;
  questionsCount?: number;
  recently?: boolean;
  liked?: boolean;
  status?: string;
}

export interface PreferencesFilters {
  theme?: string;
  checkpoints?: boolean;
  lessAnimations?: boolean;
  privateAccount?: boolean;
}

export interface CommentFilters {
  userId?: string;
  quizId?: string;
}
