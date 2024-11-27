export const categoryOptions = [
  { value: "", label: "Dowolna" },
  { value: "programming", label: "Programowanie" },
  { value: "history", label: "Historia" },
  { value: "entertainment", label: "Rozrywka" },
  { value: "geography", label: "Geografia" },
  { value: "sport", label: "Sport" },
];

export const difficultyOptions = [
  { value: "", label: "Dowolny" },
  { value: "easy", label: "Łatwy" },
  { value: "medium", label: "Średni" },
  { value: "hard", label: "Trudny" },
];

export const timeOptions = [
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
];

export const questionCountOptions = [
  { value: "", label: "Dowolna" },
  ...Array.from({ length: 13 }, (_, index) => ({
    value: (index + 3).toString(),
    label: (index + 3).toString(),
  })),
];

export const orderOptions = [
  { value: "points -1", label: "Punkty - malejąco" },
  { value: "points 1", label: "Punkty - rosnąco" },
  { value: "updatedAt -1", label: "Najnowsze" },
  { value: "updatedAt 1", label: "Najstarsze" },
  { value: "rating -1", label: "Ocena - malejąco" },
  { value: "rating 1", label: "Ocena - rosnąco" },
];
