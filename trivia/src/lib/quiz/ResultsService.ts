import type { QuizAttempt } from '../../types/results';

const RESULTS_KEY = 'tq_results';

function readAll(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeAll(list: QuizAttempt[]) {
  localStorage.setItem(RESULTS_KEY, JSON.stringify(list));
}
function genId() {
  return `res_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export class ResultsService {
  static add(attempt: Omit<QuizAttempt, 'id'>): QuizAttempt {
    const item: QuizAttempt = { id: genId(), ...attempt };
    const all = readAll();
    all.unshift(item);
    writeAll(all);
    return item;
  }

  static getAll(): QuizAttempt[] {
    return readAll();
  }

  static getByUser(userId: string): QuizAttempt[] {
    return readAll().filter((a) => a.userId === userId);
  }
}
