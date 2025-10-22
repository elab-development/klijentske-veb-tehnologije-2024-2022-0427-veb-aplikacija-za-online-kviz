import type { Difficulty } from '../../types/quiz';
import { OPEN_TDB_CATEGORIES, categoryNameById } from './opentdb';
import { QuizService } from './QuizService';

const SEED_KEY = 'tq_quizzes_seed_done';
const TARGET_MIN = 20; // želimo ~20 kvizova
const AMOUNT_TRY = [10, 9, 8, 7, 6, 5]; // fallback ako nema dovoljno pitanja

function isSeeded() {
  return localStorage.getItem(SEED_KEY) === '1';
}
function markSeeded() {
  localStorage.setItem(SEED_KEY, '1');
}
function clearSeedFlag() {
  localStorage.removeItem(SEED_KEY);
}

function existsByTitle(title: string): boolean {
  return QuizService.getAll().some(
    (q) => q.title.toLowerCase() === title.toLowerCase()
  );
}

function pickDifficulty(index: number): Difficulty {
  const order: Difficulty[] = ['easy', 'medium', 'hard'];
  return order[index % order.length];
}

/**
 * Pokuša da kreira kviz za dati categoryId i difficulty.
 * Ako amount=10 ne uspe, pokušava 9,8,...,5.
 * Vraća true ako je makar jedan kviz kreiran (ili je već postojao).
 */
async function tryCreateWithFallback(
  categoryId: number,
  difficulty: Difficulty
): Promise<boolean> {
  const baseTitle = `${categoryNameById(categoryId)} (${difficulty})`;
  const title = baseTitle; // naslov fiksiramo po kombinaciji kako bismo izbegli duplikate

  if (existsByTitle(title)) {
    return true; // već postoji — računamo ga
  }

  for (const amount of AMOUNT_TRY) {
    try {
      await QuizService.createFromOpenTDB(
        { title, categoryId, difficulty, amount },
        { id: 'seed', name: 'Seed' }
      );
      return true; // uspeo sa ovim amount-om
    } catch {
      // probaj sledeći (manji) amount
    }
  }
  return false;
}

/**
 * - bar po jedan kviz za svaku kategoriju iz OPEN_TDB_CATEGORIES (rotira težine)
 * - cilj >= TARGET_MIN kvizova ukupno (ako kategorija ima pitanja)
 * - ako neke kombinacije trenutno nemaju pitanja, preskače ih bez greške
 * - setuje SEED_KEY tek kada dostignemo cilj ili kada smo probali sve kategorije
 */
export async function ensureSeededRobust(): Promise<void> {
  if (isSeeded()) return;

  // 1) Po kategorijama — bar po jedan
  let total = QuizService.getAll().length;
  for (let i = 0; i < OPEN_TDB_CATEGORIES.length; i++) {
    const cat = OPEN_TDB_CATEGORIES[i];
    const diff = pickDifficulty(i);
    const ok = await tryCreateWithFallback(cat.id, diff);
    if (ok) {
      total = QuizService.getAll().length;
    }
  }

  // 2) Ako nismo došli do TARGET_MIN, napravi još kroz drugi krug (različita težina)
  let round = 1;
  while (total < TARGET_MIN && round < 4) {
    for (let i = 0; i < OPEN_TDB_CATEGORIES.length && total < TARGET_MIN; i++) {
      const cat = OPEN_TDB_CATEGORIES[i];
      const diff = pickDifficulty(i + round); // pomeri rotaciju
      const ok = await tryCreateWithFallback(cat.id, diff);
      if (ok) {
        total = QuizService.getAll().length;
      }
    }
    round++;
  }

  markSeeded();
}

export function resetSeed() {
  clearSeedFlag();
}
