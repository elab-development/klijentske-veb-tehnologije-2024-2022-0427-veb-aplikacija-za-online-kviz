import AnswerOption from './AnswerOption';

type Props = {
  index: number;
  questionId: string;
  question: string;
  answers: string[];
  selected?: string;
  onSelect: (qid: string, answer: string) => void;
};

export default function QuestionItem({
  index,
  questionId,
  question,
  answers,
  selected,
  onSelect,
}: Props) {
  return (
    <div className='rounded-xl border border-[#1e4a3a] bg-[#122d24] p-4'>
      <h3 className='text-emerald-100 font-medium'>
        Q{index + 1}. {question}
      </h3>
      <div className='mt-3 grid gap-2'>
        {answers.map((a) => (
          <AnswerOption
            key={a}
            name={questionId}
            value={a}
            selected={selected}
            onChange={(v) => onSelect(questionId, v)}
          />
        ))}
      </div>
    </div>
  );
}
