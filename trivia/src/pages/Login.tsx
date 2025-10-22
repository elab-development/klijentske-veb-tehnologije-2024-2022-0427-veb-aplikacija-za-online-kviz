import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import AuthCard from '../components/auth/AuthCard';
import FormInput from '../components/auth/FormInput';

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState(false);

  const errors = useMemo(() => {
    if (!touched) return {};
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email is required.';
    else if (!isValidEmail(email)) e.email = 'Please enter a valid email.';
    if (!pwd) e.pwd = 'Password is required.';
    return e;
  }, [email, pwd, touched]);

  const canSubmit = useMemo(
    () =>
      email && pwd && isValidEmail(email) && Object.keys(errors).length === 0,
    [email, pwd, errors]
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    // TODO: integrate real auth
    console.log('Login submit', { email, remember });
    navigate('/');
  }

  return (
    <AuthCard
      title='Login'
      subtitle='Access your TriviaQuest account.'
      footer={
        <p className='text-sm text-emerald-200/80'>
          No account?{' '}
          <Link to='/register' className='text-emerald-300 hover:underline'>
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className='grid gap-4'>
        <FormInput
          label='Email'
          value={email}
          onChange={setEmail}
          placeholder='you@example.com'
          autoComplete='email'
          error={errors.email}
          leftIcon={<Mail className='h-4 w-4' />}
          name='email'
        />

        <FormInput
          label='Password'
          type={showPwd ? 'text' : 'password'}
          value={pwd}
          onChange={setPwd}
          placeholder='Your password'
          autoComplete='current-password'
          error={errors.pwd}
          leftIcon={<Lock className='h-4 w-4' />}
          rightIcon={
            showPwd ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )
          }
          onRightIconClick={() => setShowPwd((v) => !v)}
          name='password'
        />

        <div className='flex items-center justify-between'>
          <label className='inline-flex items-center gap-2 text-sm text-emerald-200/90 select-none'>
            <input
              type='checkbox'
              className='h-4 w-4 rounded border-[#1e4a3a] bg-[#0f2f24]'
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>

          <button
            type='button'
            className='text-sm text-emerald-300 hover:underline'
            onClick={() => alert('Forgot password flow will be here.')}
          >
            Forgot password?
          </button>
        </div>

        <button
          type='submit'
          disabled={!canSubmit}
          className={[
            'mt-2 inline-flex justify-center items-center h-10 rounded-md px-4',
            'bg-[#1f6f54] hover:bg-[#1a5a45] text-emerald-50 border border-[#2a6a54]',
            'transition focus:outline-none focus:ring-2 focus:ring-emerald-400/40',
            !canSubmit ? 'opacity-60 cursor-not-allowed' : '',
          ].join(' ')}
          onClick={() => setTouched(true)}
        >
          <LogIn className='h-4 w-4 mr-2' />
          Continue
        </button>
      </form>
    </AuthCard>
  );
}
