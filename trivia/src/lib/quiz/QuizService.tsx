import type { AuthUser } from '../../types/auth';
import type { CreateQuizInput, Difficulty, Quiz } from '../../types/quiz';
import { fetchOpenTDBQuestions, categoryNameById } from './opentdb';

const QUIZZES_KEY = 'tq_quizzes';
const SEED_KEY = 'tq_quizzes_seed_done';

function readQuizzes(): Quiz[] {
  try {
    const raw = localStorage.getItem(QUIZZES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeQuizzes(items: Quiz[]) {
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(items));
}

function genId() {
  return `quiz_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export class QuizService {
  static getAll(): Quiz[] {
    return readQuizzes();
  }

  static getById(id: string): Quiz | undefined {
    return readQuizzes().find((q) => q.id === id);
  }

  static async createFromOpenTDB(
    input: CreateQuizInput,
    author: AuthUser | { id: 'seed'; name: 'Seed' }
  ): Promise<Quiz> {
    const questions = await fetchOpenTDBQuestions(
      input.amount,
      input.categoryId,
      input.difficulty
    );
    const quiz: Quiz = {
      id: genId(),
      title: input.title,
      categoryId: input.categoryId,
      categoryName: categoryNameById(input.categoryId),
      difficulty: input.difficulty,
      amount: input.amount,
      createdAt: new Date().toISOString(),
      createdBy: 'id' in author ? author : { id: 'seed', name: 'Seed' },
      questions,
    };
    const all = readQuizzes();
    all.unshift(quiz);
    writeQuizzes(all);
    return quiz;
  }

  /**
   * Seed ~20 kvizova (razne kategorije/težine) — samo jednom.
   */
  static async ensureSeeded(): Promise<void> {
    const done = localStorage.getItem(SEED_KEY) === '1';
    if (done) return;
    const seeds: Array<{
      categoryId: number;
      difficulty: Difficulty;
      title?: string;
    }> = [
      { categoryId: 9, difficulty: 'easy', title: 'General Knowledge (Easy)' },
      {
        categoryId: 9,
        difficulty: 'medium',
        title: 'General Knowledge (Medium)',
      },
      { categoryId: 10, difficulty: 'medium', title: 'Books (Medium)' },
      { categoryId: 11, difficulty: 'easy', title: 'Film (Easy)' },
      { categoryId: 12, difficulty: 'medium', title: 'Music (Medium)' },
      { categoryId: 14, difficulty: 'hard', title: 'Television (Hard)' },
      { categoryId: 15, difficulty: 'easy', title: 'Video Games (Easy)' },
      {
        categoryId: 17,
        difficulty: 'medium',
        title: 'Science & Nature (Medium)',
      },
      { categoryId: 18, difficulty: 'easy', title: 'Computers (Easy)' },
      { categoryId: 18, difficulty: 'hard', title: 'Computers (Hard)' },
      { categoryId: 19, difficulty: 'medium', title: 'Mathematics (Medium)' },
      { categoryId: 21, difficulty: 'easy', title: 'Sports (Easy)' },
      { categoryId: 22, difficulty: 'medium', title: 'Geography (Medium)' },
      { categoryId: 23, difficulty: 'easy', title: 'History (Easy)' },
      { categoryId: 24, difficulty: 'hard', title: 'Politics (Hard)' },
      { categoryId: 25, difficulty: 'medium', title: 'Art (Medium)' },
      { categoryId: 27, difficulty: 'easy', title: 'Animals (Easy)' },
      { categoryId: 28, difficulty: 'medium', title: 'Vehicles (Medium)' },
      { categoryId: 31, difficulty: 'easy', title: 'Anime & Manga (Easy)' },
      { categoryId: 32, difficulty: 'medium', title: 'Cartoons (Medium)' },
    ];

    try {
      const created = await Promise.all(
        seeds.map((seed) =>
          QuizService.createFromOpenTDB(
            {
              title:
                seed.title ??
                `${categoryNameById(seed.categoryId)} (${seed.difficulty})`,
              categoryId: seed.categoryId,
              difficulty: seed.difficulty,
              amount: 10,
            },
            { id: 'seed', name: 'Seed' }
          )
        )
      );
      if (created.length > 0) {
        localStorage.setItem(SEED_KEY, '1');
      }
    } catch (e) {
      // Ako poneki seed ne uspe (npr. nema dostupnih pitanja), ignorišemo i idemo dalje.
      localStorage.setItem(SEED_KEY, '1');
    }
  }
}
