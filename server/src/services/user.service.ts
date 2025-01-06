import { ClientSession, ObjectId } from "mongoose";
import { IAchievement } from "../models/achievement.model";
import UserRepository from "../repository/user.repository";
import UserPrivateRepository from "../repository/userPrivate.repository";
import UserProfileRepository from "../repository/userProfile.repository";
import AchievementRepository from "../repository/achievement.repository";
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
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

class UserService {
  async handleAchievementUpdate(
    userId: ObjectId,
    achievementName: string,
    achievementIncreaseValue: number,
    session: ClientSession
  ): Promise<string | undefined> {
    const user = await ValidationService.validateUser(userId);

    const userAchievement = await UserProfileRepository.addValueToAchievement(
      user.userProfile,
      achievementName,
      achievementIncreaseValue,
      { session }
    );

    if (!userAchievement.value)
      throw new Error(
        `Próba pobrania szczegółów postępu osiągnięcia "${achievementName}" zakończona niepowodzeniem.`
      );

    const achievement = await AchievementRepository.getSingleAchievement(
      achievementName,
      { session }
    );
    if (!achievement)
      throw new Error(
        `Próba pobrania informacji o osiągnięciu "${achievementName}" zakończona niepowodzeniem.`
      );

    let achievementLevel;

    for (const level of achievement.levels) {
      if (level.requirement <= userAchievement.value) {
        achievementLevel = level.level;
      }
    }

    if (achievementLevel !== userAchievement.level) {
      const updatedAchievementLevel =
        await UserProfileRepository.changeAchievementLevel(
          user.userProfile,
          achievementName,
          { session }
        );

      if (!updatedAchievementLevel) {
        throw new Error(
          `Niepowodzenie w zaktualizowaniu postępów osiągnięcia "${achievementName}".`
        );
      }

      const currentLevel = achievement.levels.find(
        (lvl: any) => lvl.level === updatedAchievementLevel
      );

      const existingTitle = await UserProfileRepository.verifyIfUserHaveTitle(
        user.userProfile,
        currentLevel.title,
        { session }
      );

      if (existingTitle) {
        return `Posiadasz już tytuł "${currentLevel.title}".`;
      }

      if (currentLevel && currentLevel.title) {
        await UserProfileRepository.addTitle(
          user.userProfile,
          currentLevel.title,
          {
            session,
          }
        );
        return `Tytuł "${currentLevel.title}" został przyznany do Twojego konta.`;
      }
      return `Zdobyto ${achievementLevel} poziom w osiągnieciu "${achievementName}".`;
    }
    return `Postęp w osiągnieciu "${achievementName}" został przyznany`;
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
        throw new Error("Użytownik z tym loginem juz istnieje.");
      const userExistEmail = await UserPrivateRepository.findByEmail(email, {
        session,
      });
      if (userExistEmail)
        throw new Error("Użytownik z tym emailem juz istnieje.");
      const userExistNickname = await UserRepository.findByNickname(nickname, {
        session,
      });
      if (userExistNickname)
        throw new Error("Użytownik o tej nazwie juz istnieje.");

      if (nickname.length < 5)
        throw new Error("Pseudonim musi zawierać minimum 5 znaków.");

      if (password.length < 8)
        throw new Error("Hasło musi zawierać minimum 8 znaków.");

      if (!passwordRegex.test(password))
        throw new Error(
          "Hasło musi zawierać minimum jedną cyfrę i nie zawierać znaków specjalnych."
        );

      if (!emailRegex.test(email))
        throw new Error("Email musi być w odpowiednim formacie - example@x.y");
      const hashedPassword = await bcrypt.hash(password, 10);

      const allAchievements = await AchievementService.getAchievements({
        session,
      });

      const achievements = allAchievements.map((achievement: IAchievement) => ({
        achievementId: achievement._id,
        name: achievement.name,
        level: 1,
      }));
      const userProfile = await UserProfileRepository.create(achievements, {
        session,
      });
      const user = await UserRepository.create(nickname, userProfile._id, {
        session,
      });

      const userPrivate = await UserPrivateRepository.create(
        user._id,
        login,
        hashedPassword,
        email,
        { session }
      );

      if (!user || !userPrivate || !userProfile)
        throw new Error("Błędne dane użytkownika.");

      const loggedUser = await UserRepository.findUserWithUserProfileById(
        userPrivate.userId,
        { session }
      );
      if (!user) throw new Error("Użytkownik nie istnieje.");
      return {
        ...loggedUser,
        token: generateToken(loggedUser._id),
      };
    });
  }

  async loginUser(login: string, password: string): Promise<any> {
    const userPrivate = await UserPrivateRepository.findByLogin(login);
    if (!userPrivate) throw new Error("Błędny login lub hasło.");
    const isPasswordValid = await bcrypt.compare(
      password,
      userPrivate.password
    );

    if (!isPasswordValid) throw new Error("Błędny login lub hasło.");

    const user = await UserRepository.findUserWithUserProfileById(
      userPrivate.userId
    );
    if (!user) throw new Error("Użytkownik nie istnieje.");
    return {
      ...user,
      token: generateToken(user._id),
    };
  }

  async deleteUser(userId: ObjectId, password: string) {
    return withTransaction(async (session) => {
      const user = await ValidationService.validateUser(userId, { session });

      const userPassword = await UserPrivateRepository.getOldPassword(userId, {
        session,
      });
      const isPasswordValid = await bcrypt.compare(password, userPassword);
      if (!isPasswordValid) throw new Error("Błędne hasło.");

      await commentRepository.deleteUserComments(userId, { session });
      await ratingRepository.deleteUserRatings(userId, { session });
      const quizzesToDelete = await quizRepository.findUserQuizzesIds(userId, {
        session,
      });
      const quizzesIds = quizzesToDelete.map((quiz: any) => quiz._id);
      const quizDetailsIds = quizzesToDelete.map(
        (quiz: any) => quiz.quizDetails
      );

      if (quizzesIds && quizDetailsIds) {
        await quizRepository.deleteUserQuizzes(quizzesIds, { session });
        await commentRepository.deleteCommentsFromMultipleQuizzes(quizzesIds, {
          session,
        });
        await ratingRepository.deleteRatingsFromMultipleQuizzes(quizzesIds, {
          session,
        });
        await quizDetailsRepository.deleteQuizDetailsFromMultipleQuizzes(
          quizDetailsIds,
          { session }
        );
      }
      await UserProfileRepository.deleteUserProfile(user.userProfile, {
        session,
      });
      await UserPrivateRepository.deleteUserPrivate(userId, { session });
      await UserRepository.deleteUser(userId, { session });
      return "Użytkownik usunięty pomyślnie.";
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
          throw new Error("Hasła różnią się.");

        const oldFetchedPassword = await UserPrivateRepository.getOldPassword(
          userId,
          { session }
        );

        const isPasswordValid = await bcrypt.compare(
          oldPassword,
          oldFetchedPassword
        );

        if (!isPasswordValid) throw new Error("Błędne hasło");
        const isPasswordSame = await bcrypt.compare(
          newPassword,
          oldFetchedPassword
        );

        if (isPasswordSame)
          throw new Error("Hasło nie może być takie samo jak poprzednie.");

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        userPrivateFilter.password = hashedPassword;
      }

      if (nickname) {
        const nicknameExist = await UserRepository.findByNickname(nickname);
        if (nicknameExist)
          throw new Error("Użytkownik z tym pseudonimem juz istnieje.");
        user = await UserRepository.changeNickname(userId, nickname, {
          session,
        });
      }

      if (filters.login) {
        const loginExist = await UserPrivateRepository.findByLogin(
          filters.login
        );
        if (loginExist)
          throw new Error("Użytkownik z tym loginem juz istnieje.");
        userPrivateFilter.login = filters.login;
      }

      if (filters.email) {
        const emailExist = await UserPrivateRepository.findByEmail(
          filters.email
        );
        if (emailExist)
          throw new Error("Użytkownik z tym emailem juz istnieje.");
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
      throw new Error("Nie możesz zmienić zdjęcia na to samo.");
    if (!profilePictureRegex.test(imgQuery))
      throw new Error("Błedny typ przekazywanego zdjęcia.");

    return await UserRepository.editProfilePicture(userId, imgQuery);
  }

  async editPreferences(userId: ObjectId, filters: PreferencesFilters) {
    return withTransaction(async (session) => {
      const updateFields: Partial<PreferencesFilters> = {};
      const user = await ValidationService.validateUser(userId);
      const userProfile = await UserProfileRepository.findUserProfileById(
        user.userProfile
      );

      (Object.keys(filters) as (keyof PreferencesFilters)[]).forEach((key) => {
        const value = filters[key];
        if (value !== undefined && value !== userProfile[key]) {
          updateFields[key] = value as any;
        }
      });
      if (Object.keys(updateFields).length > 0) {
        if (filters.privateAccount)
          await UserRepository.editPrivateAccount(
            userId,
            filters.privateAccount,
            { session }
          );
        await UserProfileRepository.editPreferences(
          user.userProfile,
          updateFields
        );

        const editedUser = await UserRepository.findUserWithUserProfileById(
          userId
        );
        return { user: editedUser, message: "Preferencje zaktualizowane." };
      } else throw new Error("Brak wybranych zmian.");
    });
  }

  async addFinishedQuizData(
    userId: ObjectId,
    quizId: ObjectId,
    points: number
  ) {
    return withTransaction(async (session) => {
      await ValidationService.validateUser(userId, { session });
      await ValidationService.validateQuiz(quizId, { session });
      if (!points) throw new Error("Nie przyznano punktów.");

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
    const oldUser = await ValidationService.validateUser(userId);
    for (const title of titles) {
      const availableTitle = await UserProfileRepository.verifyIfUserHaveTitle(
        oldUser.userProfile,
        title
      );
      if (!availableTitle) throw new Error(`Title ${title} is not avaiable.`);
    }
    const user = await UserRepository.changeDisplayedTitles(userId, titles);
    return { user, message: "Tytuły zostały zaktualizowane." };
  }
}

module.exports = new UserService();
