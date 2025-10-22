import { type ReactNode, useId } from 'react';

type Props = {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  name?: string;
};

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  leftIcon,
  rightIcon,
  onRightIconClick,
  name,
}: Props) {
  const id = useId();
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className='grid gap-1'>
      <label htmlFor={id} className='text-sm text-emerald-100'>
        {label}
      </label>

      <div
        className={[
          'flex items-center gap-2 rounded-md border bg-[#0f2f24]',
          error ? 'border-red-500/60' : 'border-[#1e4a3a]',
          'focus-within:ring-2 focus-within:ring-emerald-400/40',
        ].join(' ')}
      >
        {leftIcon && (
          <span className='pl-3 text-emerald-200/80'>{leftIcon}</span>
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className='w-full bg-transparent text-emerald-100 placeholder:text-emerald-200/40 outline-none px-3 py-2'
        />

        {rightIcon && (
          <button
            type='button'
            onClick={onRightIconClick}
            className='pr-3 text-emerald-200/80 hover:text-emerald-100'
            aria-label='toggle visibility'
          >
            {rightIcon}
          </button>
        )}
      </div>

      {error && (
        <p id={describedBy} className='text-xs text-red-400'>
          {error}
        </p>
      )}
    </div>
  );
}
