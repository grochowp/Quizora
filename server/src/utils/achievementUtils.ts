import { ClientSession, ObjectId } from "mongoose";
import userProfileRepository from "../repository/userProfile.repository";
import achievementRepository from "../repository/achievement.repository";

const userService = require("../services/user.service");

/**
 * REFACTOR - probably useless but i`ll leave it for now, just in case
 */

// export const achievementLikedQuizzesRequirements: Record<number, number> = {
//   1: 0,
//   2: 5,
//   3: 10,
//   4: 25,
//   5: 50,
// };

// export const achievementsLikedQuizzesTitles: Record<number, string> = {
//   3: "Krytyk",
//   5: "Recenzent",
// };

// export const achievementCreatedQuizzesRequirements: Record<number, number> = {
//   1: 0,
//   2: 2,
//   3: 5,
//   4: 10,
//   5: 20,
// };

// export const achievementsCreatedQuizzesTitles: Record<number, string> = {
//   3: "Kreator",
//   5: "Stwórca",
// };

// export const achievementFinishedQuizzesRequirements: Record<number, number> = {
//   1: 0,
//   2: 10,
//   3: 25,
//   4: 40,
//   5: 75,
// };

// export const achievementsFinishedQuizzesTitles: Record<number, string> = {
//   3: "Znawca",
//   5: "Legenda",
// };

// export const achievementPointsRequirements: Record<number, number> = {
//   1: 0,
//   2: 100,
//   3: 250,
//   4: 500,
//   5: 1000,
// };

// export const achievementsPointsTitles: Record<number, string> = {
//   3: "Zbieracz",
//   5: "Król Skarbów",
// };
