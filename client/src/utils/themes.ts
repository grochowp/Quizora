import { IThemes } from "../interfaces";

export const themes: IThemes[] = [
  { name: "default", label: "Podstawowy" },
  { name: "light", label: "Jasny" },
  { name: "blue", label: "Niebieski" },
  { name: "green", label: "Zielony", unlockAt: "Kreator" },
  { name: "noir", label: "Noir", unlockAt: "Legenda" },
  { name: "cosmic", label: "Kosmiczny", unlockAt: "Legenda" },
];
