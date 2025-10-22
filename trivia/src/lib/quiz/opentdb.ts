import type { Difficulty, NormalizedQuestion } from '../../types/quiz';

// Minimal category map (OpenTriviaDB official IDs)
export const OPEN_TDB_CATEGORIES: { id: number; name: string }[] = [
  { id: 9, name: 'General Knowledge' },
  { id: 10, name: 'Books' },
  { id: 11, name: 'Film' },
  { id: 12, name: 'Music' },
  { id: 14, name: 'Television' },
  { id: 15, name: 'Video Games' },
  { id: 17, name: 'Science & Nature' },
  { id: 18, name: 'Computers' },
  { id: 19, name: 'Mathematics' },
  { id: 20, name: 'Mythology' },
  { id: 21, name: 'Sports' },
  { id: 22, name: 'Geography' },
  { id: 23, name: 'History' },
  { id: 24, name: 'Politics' },
  { id: 25, name: 'Art' },
  { id: 27, name: 'Animals' },
  { id: 28, name: 'Vehicles' },
  { id: 29, name: 'Comics' },
  { id: 30, name: 'Gadgets' },
  { id: 31, name: 'Anime & Manga' },
  { id: 32, name: 'Cartoon & Animations' },
];

function decodeHtmlEntities(s: string) {
  if (typeof window === 'undefined') return s;
  const el = document.createElement('textarea');
  el.innerHTML = s;
  return el.value;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function genId() {
  return `q_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export async function fetchOpenTDBQuestions(
  amount: number,
  categoryId: number,
  difficulty: Difficulty
): Promise<NormalizedQuestion[]> {
  const url = new URL('https://opentdb.com/api.php');
  url.searchParams.set('amount', String(amount));
  url.searchParams.set('category', String(categoryId));
  url.searchParams.set('difficulty', difficulty);
  url.searchParams.set('type', 'multiple');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch questions from OpenTriviaDB');
  const data = await res.json();

  if (data.response_code !== 0 || !Array.isArray(data.results)) {
    throw new Error(
      'OpenTriviaDB returned no results for the given parameters.'
    );
  }

  const normalized: NormalizedQuestion[] = data.results.map((r: any) => {
    const question = decodeHtmlEntities(r.question);
    const correct = decodeHtmlEntities(r.correct_answer);
    const incorrect = (r.incorrect_answers || []).map((x: string) =>
      decodeHtmlEntities(x)
    );
    const all = shuffle([correct, ...incorrect]);
    return {
      id: genId(),
      question,
      correctAnswer: correct,
      incorrectAnswers: incorrect,
      allAnswers: all,
    };
  });

  return normalized;
}

export function categoryNameById(id: number): string {
  return OPEN_TDB_CATEGORIES.find((c) => c.id === id)?.name ?? `Category ${id}`;
}
