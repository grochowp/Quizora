import { ClientSession, ObjectId } from "mongoose";
import { IAchievement } from "../models/achievement.model";
import UserRepository from "../repository/user.repository";
import UserPrivateRepository from "../repository/userPrivate.repository";
import UserProfileRepository from "../repository/userProfile.repository";
import AchievementRepository from "../repository/achievement.repository";
import { IUser } from "../models/user.model";
import { withTransaction } from "../utils/transaction";
import {
  EditProfileFilters,
  PreferencesFilters,
  UserPrivateFilters,
} from "../types/interfaces";
import commentRepository from "../repository/comment.repository";
import ratingRepository from "../repository/rating.repository";
import quizRepository from "../repository/quiz.repository";
import quizDetailsRepository from "../repository/quizDetails.repository";

const AchievementService = require("./achievement.service");
const ValidationService = require("./validation.service");

const bcrypt = require("bcrypt");
const { generateToken } = require("../config/authentication");

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const profilePictureRegex =
  /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

class UserService {
  async handleAchievementUpdate(
    userId: ObjectId,
    achievementName: string,
    achievementIncreaseValue: number,
    session: ClientSession
  ): Promise<string | undefined> {
    await ValidationService.validateUser(userId);

    const userAchievement = await UserProfileRepository.addValueToAchievement(
      userId,
      achievementName,
      achievementIncreaseValue,
      { session }
    );

    if (!userAchievement.value)
      throw new Error(
        `Failed to fetch your ${achievementName} achievement progress.`
      );

    const achievement = await AchievementRepository.getSingleAchievement(
      achievementName,
      { session }
    );
    if (!achievement)
      throw new Error(`Failed to fetch your ${achievementName} achievement.`);

    let achievementLevel;

    for (const level of achievement.levels) {
      if (level.requirement <= userAchievement.value) {
        achievementLevel = level.level;
      }
    }

    if (achievementLevel !== userAchievement.level) {
      const updatedAchievementLevel =
        await UserProfileRepository.changeAchievementLevel(
          userId,
          achievementName,
          { session }
        );

      if (!updatedAchievementLevel) {
        throw new Error(
          `Failed to change your ${achievementName} achievement level.`
        );
      }

      const currentLevel = achievement.levels.find(
        (lvl: any) => lvl.level === updatedAchievementLevel
      );

      const existingTitle = await UserProfileRepository.verifyIfUserHaveTitle(
        userId,
        currentLevel.title,
        { session }
      );

      if (existingTitle) {
        return `Title ${currentLevel.title} has been already at your account.`;
      }

      if (currentLevel && currentLevel.title) {
        await UserProfileRepository.addTitle(userId, currentLevel.title, {
          session,
        });
        return `Title ${currentLevel.title} has been granted to your account.`;
      }
      return `You reached ${achievementLevel} level at ${achievementName} achievement.`;
    }
    return `${achievementName} achievement progress granted.`;
  }

  async registerUser(
    login: string,
    password: string,
    email: string,
    nickname: string
  ): Promise<any> {
    return withTransaction(async (session) => {
      const userExistLogin = await UserPrivateRepository.findByLogin(login, {
        session,
      });
      if (userExistLogin)
        throw new Error("User with this login already exists.");
      const userExistEmail = await UserPrivateRepository.findByEmail(email, {
        session,
      });
      if (userExistEmail)
        throw new Error("User with this email already exists.");
      const userExistNickname = await UserRepository.findByNickname(nickname, {
        session,
      });
      if (userExistNickname)
        throw new Error("User with this nickname already exists.");

      if (password.length < 8)
        throw new Error("Password must be at least 8 characters long.");

      if (!passwordRegex.test(password))
        throw new Error(
          "Password must be at least 8 characters long and include at least one letter and one digit."
        );

      const hashedPassword = await bcrypt.hash(password, 10);

      const allAchievements = await AchievementService.getAchievements({
        session,
      });

      const achievements = allAchievements.map((achievement: IAchievement) => ({
        achievementId: achievement._id,
        name: achievement.name,
        level: 1,
      }));
      const user = await UserRepository.create(nickname, { session });

      const userPrivate = await UserPrivateRepository.create(
        user._id,
        login,
        hashedPassword,
        email,
        { session }
      );

      const userProfile = await UserProfileRepository.create(
        user._id,
        achievements,
        { session }
      );

      if (!user || !userPrivate || !userProfile)
        throw new Error("Invalid user data");

      const loggedUser = await UserProfileRepository.findUserProfileById(
        userPrivate.userId,
        {
          session,
        }
      );
      if (!user) throw new Error("User does not exist");
      const userTokenData = loggedUser.user as IUser;
      return {
        ...loggedUser,
        token: generateToken(userTokenData._id),
      };
    });
  }

  async loginUser(login: string, password: string): Promise<any> {
    const userPrivate = await UserPrivateRepository.findByLogin(login);
    if (!userPrivate) throw new Error("Invalid login or password");
    const isPasswordValid = await bcrypt.compare(
      password,
      userPrivate.password
    );

    if (!isPasswordValid) throw new Error("Invalid login or password");

    const user = await UserProfileRepository.findUserProfileById(
      userPrivate.userId
    );
    if (!user) throw new Error("User does not exist");
    const userTokenData = user.user as IUser;
    return {
      ...user,
      token: generateToken(userTokenData._id),
    };
  }

  async deleteUser(userId: ObjectId, password: string) {
    return withTransaction(async (session) => {
      await ValidationService.validateUser(userId, { session });

      const userPassword = await UserPrivateRepository.getOldPassword(userId, {
        session,
      });
      const isPasswordValid = await bcrypt.compare(password, userPassword);
      if (!isPasswordValid) throw new Error("Invalid password.");

      await commentRepository.deleteUserComments(userId, { session });
      await ratingRepository.deleteUserRatings(userId, { session });
      const quizzesIds = await quizRepository.findUserQuizzesIds(userId, {
        session,
      });
      if (quizzesIds) {
        await quizRepository.deleteUserQuizzes(quizzesIds, { session });
        await commentRepository.deleteCommentsFromMultipleQuizzes(quizzesIds, {
          session,
        });
        await ratingRepository.deleteRatingsFromMultipleQuizzes(quizzesIds, {
          session,
        });
        await quizDetailsRepository.deleteQuizDetailsFromMultipleQuizzes(
          quizzesIds,
          { session }
        );
      }
      await UserProfileRepository.deleteUserProfile(userId, { session });
      await UserPrivateRepository.deleteUserPrivate(userId, { session });
      await UserRepository.deleteUser(userId, { session });
      return "User has been deleted succesfully.";
    });
  }

  async findUserById(userId: ObjectId) {
    await ValidationService.validateUser(userId);
    return UserRepository.findUserById(userId);
  }

  async getMultipleUsers(
    query: string,
    page: number,
    limit: number,
    sortBy: string
  ) {
    const skip = (page - 1) * limit;
    const sortOptions: Record<string, 1 | -1> = {};
    if (sortBy) {
      sortOptions[sortBy] = -1;
    }
    const users = await UserRepository.getMultipleUsers(
      query,
      skip,
      limit,
      sortOptions
    );
    return users;
  }

  async editProfile(
    userId: ObjectId,
    nickname: string,
    filters: EditProfileFilters
  ) {
    return withTransaction(async (session) => {
      let user, userPrivate;
      const userPrivateFilter: UserPrivateFilters = {};

      await ValidationService.validateUser(userId, { session });

      if (!nickname && Object.keys(filters).length === 0) {
        throw new Error("Invalid data.");
      }

      const { oldPassword, newPassword, newPasswordRepeat } = filters;

      const isPasswordUpdate = oldPassword && newPassword && newPasswordRepeat;

      if (isPasswordUpdate) {
        if (newPassword !== newPasswordRepeat)
          throw new Error("New password values are different.");

        const oldFetchedPassword = await UserPrivateRepository.getOldPassword(
          userId,
          { session }
        );

        const isPasswordValid = await bcrypt.compare(
          oldPassword,
          oldFetchedPassword
        );

        if (!isPasswordValid) throw new Error("Wrong password.");
        const isPasswordSame = await bcrypt.compare(
          newPassword,
          oldFetchedPassword
        );

        if (isPasswordSame)
          throw new Error("Password must be different than current one.");

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        userPrivateFilter.password = hashedPassword;
      }

      if (nickname) {
        const nicknameExist = await UserRepository.findByNickname(nickname);
        if (nicknameExist)
          throw new Error("User with this nickname already exist.");
        user = await UserRepository.changeNickname(userId, nickname, {
          session,
        });
      }

      if (filters.login) {
        const loginExist = await UserPrivateRepository.findByLogin(
          filters.login
        );
        if (loginExist) throw new Error("User with this login already exist.");
        userPrivateFilter.login = filters.login;
      }

      if (filters.email) {
        const emailExist = await UserPrivateRepository.findByEmail(
          filters.email
        );
        if (emailExist) throw new Error("User with this email already exist.");
        userPrivateFilter.email = filters.email;
      }

      if (Object.keys(filters).length > 0) {
        userPrivate = await UserPrivateRepository.editProfile(
          userId,
          userPrivateFilter,
          { session }
        );
      }
      return { user, userPrivate };
    });
  }

  async editProfilePicture(userId: ObjectId, imgQuery: string) {
    const user = await ValidationService.validateUser(userId);
    if (user.profilePicture === imgQuery)
      throw new Error("You can`t change profile picture to the same image.");
    if (!profilePictureRegex.test(imgQuery))
      throw new Error("You must provide a link in imgQuery.");

    return await UserRepository.editProfilePicture(userId, imgQuery);
  }

  async editPreferences(userId: ObjectId, filters: PreferencesFilters) {
    const updateFields: Partial<PreferencesFilters> = {};
    await ValidationService.validateUser(userId);
    const userProfile = await UserProfileRepository.findUserProfileById(userId);

    (Object.keys(filters) as (keyof PreferencesFilters)[]).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== userProfile[key]) {
        updateFields[key] = value as any;
      }
    });

    if (Object.keys(updateFields).length > 0) {
      await UserProfileRepository.editPreferences(userId, updateFields);
      return "Preferences updated.";
    } else throw new Error("No changes selected.");
  }

  async addFinishedQuizData(
    userId: ObjectId,
    quizId: ObjectId,
    points: number
  ) {
    return withTransaction(async (session) => {
      await ValidationService.validateUser(userId, { session });
      await ValidationService.validateQuiz(quizId, { session });
      if (!points) throw new Error("No points provided.");

      await UserRepository.addFinishedQuizData(userId, points, { session });
      const finishQuizMessage = await this.handleAchievementUpdate(
        userId,
        "Ukończ Quizy",
        1,
        session
      );

      const addPointsMessage = await this.handleAchievementUpdate(
        userId,
        "Zdobądź Punkty",
        points,
        session
      );
      return { finishQuizMessage, addPointsMessage };
    });
  }

  async changeDisplayedTitles(userId: ObjectId, titles: Array<string>) {
    await ValidationService.validateUser(userId);
    for (const title of titles) {
      const availableTitle = await UserProfileRepository.verifyIfUserHaveTitle(
        userId,
        title
      );
      if (!availableTitle) throw new Error(`Title ${title} is not avaiable.`);
    }
    const user = await UserRepository.changeDisplayedTitles(userId, titles);
    return { user, message: "Titles has been updated." };
  }
}

module.exports = new UserService();
