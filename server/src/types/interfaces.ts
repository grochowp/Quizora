import { IUser } from "../models/user.model";

export interface UserTokenRequest extends Request {
  user: IUser;
}

export interface QuizFilters {
  userId?: string;
  difficulty?: string;
  category?: string;
  title?: string;
  questionsCount?: number;
  recently?: boolean;
}

export interface CommentFilters {
  userId?: string;
  quizId?: string;
}
