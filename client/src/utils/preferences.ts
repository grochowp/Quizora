import { IPreferences, IThemes } from "../interfaces";

export const themes: IThemes[] = [
  { name: "default", label: "Podstawowy" },
  { name: "light", label: "Jasny" },
  { name: "blue", label: "Niebieski" },
  { name: "green", label: "Zielony", unlockAt: "Kreator" },
  { name: "noir", label: "Noir", unlockAt: "Zbieracz" },
  { name: "cosmic", label: "Kosmiczny", unlockAt: "Legenda" },
];

export const preferences: IPreferences[] = [
  {
    title: "Osiągnięcia - Punkty kontrolne",
    description: "Pokazuj wymagany postęp zamiast nazwy poziomu",
    name: "checkpoints",
  },

  {
    title: "Ogólne - Konto prywatne",
    description:
      "Wyłącz możliwość przeglądania Twojego profilu przez innych użytkowników",
    name: "privateAccount",
  },

  {
    title: "Ogólne - Mniej animacji Quizów",
    description: "Wyłącz animacje Quizów przy prezentacji",
    name: "lessAnimations",
  },

  // {
  //   title: "Osiągnięcia - Punkty kontrolne",
  //   description: "Pokazuj wymagany postęp zamiast nazwy poziomu",
  //   name: "achievements",
  //   unlockAt: "Legenda",
  // },
];
