export type Difficulty = 'easy' | 'medium' | 'hard';

export type NormalizedQuestion = {
  id: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  allAnswers: string[];
};

export type Quiz = {
  id: string;
  title: string;
  categoryId: number;
  categoryName: string;
  difficulty: Difficulty;
  amount: number;
  createdAt: string;
  createdBy: { id: string; name: string } | { id: 'seed'; name: 'Seed' };
  questions: NormalizedQuestion[];
};

export type CreateQuizInput = {
  title: string;
  categoryId: number;
  difficulty: Difficulty;
  amount: number;
};
