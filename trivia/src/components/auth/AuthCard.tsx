import { type ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className='min-h-screen grid place-items-center px-4 bg-[#0b1f19]'>
      <div className='w-full max-w-sm rounded-xl p-6 bg-[#122d24] border border-[#1e4a3a] shadow-lg shadow-emerald-900/20'>
        <h1 className='text-xl font-semibold text-emerald-100'>{title}</h1>
        {subtitle && (
          <p className='mt-2 text-sm text-emerald-200/80'>{subtitle}</p>
        )}
        <div className='mt-6'>{children}</div>
        {footer && <div className='mt-6'>{footer}</div>}
      </div>
    </div>
  );
}
