import { CheckCircle, XCircle } from 'lucide-react';

type Props = {
  open: boolean;
  correct: number;
  total: number;
  onClose: () => void;
};

export default function ResultModal({ open, correct, total, onClose }: Props) {
  if (!open) return null;
  const percent = Math.round((correct / total) * 100);

  return (
    <div className='fixed inset-0 z-50'>
      <div className='absolute inset-0 bg-black/60' />
      <div className='absolute inset-0 grid place-items-center p-4'>
        <div className='w-full max-w-sm rounded-xl p-6 bg-[#122d24] border border-[#1e4a3a] text-emerald-100 shadow-xl'>
          <div className='flex items-center gap-3'>
            {percent >= 50 ? (
              <CheckCircle className='h-6 w-6 text-emerald-400' />
            ) : (
              <XCircle className='h-6 w-6 text-red-400' />
            )}
            <h3 className='text-lg font-semibold'>Your result</h3>
          </div>
          <p className='mt-3 text-emerald-200/85'>
            Correct answers: <span className='font-semibold'>{correct}</span> /{' '}
            {total} ({percent}%)
          </p>
          <button
            onClick={onClose}
            className='mt-5 inline-flex justify-center items-center h-10 rounded-md px-4
                       bg-[#1f6f54] hover:bg-[#1a5a45] text-emerald-50 border border-[#2a6a54] transition w-full'
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
