export type QuizAnswerMap = Record<string, string>;
export type QuizAttempt = {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  userName: string;
  total: number;
  correct: number;
  percent: number;
  startedAt: string;
  finishedAt: string;
};
