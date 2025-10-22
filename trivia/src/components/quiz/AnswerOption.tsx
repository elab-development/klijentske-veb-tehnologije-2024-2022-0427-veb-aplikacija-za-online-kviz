type Props = {
  name: string;
  value: string;
  selected: string | undefined;
  onChange: (v: string) => void;
};

export default function AnswerOption({
  name,
  value,
  selected,
  onChange,
}: Props) {
  const checked = selected === value;
  return (
    <label
      className={[
        'flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer transition',
        checked
          ? 'border-[#2a6a54] bg-[#1f6f54] text-emerald-50'
          : 'border-[#1e4a3a] bg-[#0f2f24] text-emerald-100 hover:bg-[#123328]',
      ].join(' ')}
    >
      <input
        type='radio'
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className='accent-emerald-500'
      />
      <span className='text-sm'>{value}</span>
    </label>
  );
}
