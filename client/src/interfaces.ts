export interface IUser {
  _id: string;
  nickname: string;
  points: number;
  profilePicture: string;
  createdAt: Date;
  activeTitles: Array<string>;
  createdQuizzes: number;
  finishedQuizzes: number;
  likedQuizzes: number;
  privateAccount: boolean;
  userProfile?: IUserProfile;
}

export interface IUserProfile {
  _id: string;
  theme: string;
  checkpoints: boolean;
  lessAnimations: boolean;
  privateAccount: boolean;
  titles: Array<string>;
  achievements: [IAchievement];
}

export interface IAchievement {
  _id: string;
  name: string;
  description: string;
  levels: [
    {
      level: number;
      title?: string;
      requirement: number;
    },
  ];
}

export interface IQuiz {
  _id: string;
  title: string;
  description: string;
  time: number;
  category: string;
  createdBy: string;
  updatedAt: Date;
  rating: number;
  points: number;
  questions: number;
  difficulty: string;
  status: "draft" | "archived" | "published";
  quizDetails: IQuizDetails;
  user: IUser;
}

export interface IQuestion {
  question: string;
  answers: Array<string>;
  correctAnswerIndex: number;
}

export interface IQuizDetails {
  _id: string;
  questions: Array<IQuestion>;
}

export interface IFormData {
  login: string;
  nickname: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

export interface IStatus {
  text: string;
  status: string;
}

export interface IThemes {
  name: string;
  label: string;
  unlockAt?: string;
}
