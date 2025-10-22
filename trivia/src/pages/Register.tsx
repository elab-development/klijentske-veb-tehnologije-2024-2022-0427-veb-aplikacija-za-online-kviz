import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import AuthCard from '../components/auth/AuthCard';
import FormInput from '../components/auth/FormInput';
import { useAuth } from '../context/AuthContext';

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(true);
  const [touched, setTouched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const errors = useMemo(() => {
    if (!touched) return {};
    const e: Record<string, string> = {};
    if (!name) e.name = 'Full name is required.';
    if (!email) e.email = 'Email is required.';
    else if (!isValidEmail(email)) e.email = 'Please enter a valid email.';
    if (!pwd) e.pwd = 'Password is required.';
    else if (pwd.length < 6) e.pwd = 'Password must be at least 6 characters.';
    if (!confirm) e.confirm = 'Please confirm your password.';
    else if (pwd !== confirm) e.confirm = 'Passwords do not match.';
    if (!terms) e.terms = 'You must accept the Terms.';
    return e;
  }, [name, email, pwd, confirm, terms, touched]);

  const canSubmit = useMemo(
    () =>
      name &&
      email &&
      pwd &&
      confirm &&
      isValidEmail(email) &&
      pwd.length >= 6 &&
      pwd === confirm &&
      terms &&
      Object.keys(errors).length === 0,
    [name, email, pwd, confirm, terms, errors]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setErrorMsg(null);
    if (!canSubmit) return;
    try {
      await register(name, email, pwd);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registration failed.');
    }
  }

  return (
    <AuthCard
      title='Create account'
      subtitle='Join TriviaQuest and start playing.'
      footer={
        <p className='text-sm text-emerald-200/80'>
          Already have an account?{' '}
          <Link to='/login' className='text-emerald-300 hover:underline'>
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className='grid gap-4'>
        {errorMsg && (
          <div className='rounded-md border border-red-500/50 bg-red-500/10 text-red-200 px-3 py-2 text-sm'>
            {errorMsg}
          </div>
        )}

        <FormInput
          label='Full name'
          value={name}
          onChange={setName}
          placeholder='John Doe'
          autoComplete='name'
          error={(errors as any).name}
          leftIcon={<User className='h-4 w-4' />}
          name='name'
        />

        <FormInput
          label='Email'
          value={email}
          onChange={setEmail}
          placeholder='you@example.com'
          autoComplete='email'
          error={(errors as any).email}
          leftIcon={<Mail className='h-4 w-4' />}
          name='email'
        />

        <FormInput
          label='Password'
          type={showPwd ? 'text' : 'password'}
          value={pwd}
          onChange={setPwd}
          placeholder='Create a password'
          autoComplete='new-password'
          error={(errors as any).pwd}
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

        <FormInput
          label='Confirm password'
          type={showConfirm ? 'text' : 'password'}
          value={confirm}
          onChange={setConfirm}
          placeholder='Repeat password'
          autoComplete='new-password'
          error={(errors as any).confirm}
          leftIcon={<Lock className='h-4 w-4' />}
          rightIcon={
            showConfirm ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )
          }
          onRightIconClick={() => setShowConfirm((v) => !v)}
          name='confirmPassword'
        />

        <div className='flex items-start justify-between gap-3'>
          <label className='inline-flex items-center gap-2 text-sm text-emerald-200/90 select-none'>
            <input
              type='checkbox'
              className='h-4 w-4 rounded border-[#1e4a3a] bg-[#0f2f24]'
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            I agree to the{' '}
            <button type='button' className='text-emerald-300 hover:underline'>
              Terms
            </button>
          </label>
          {(errors as any).terms && (
            <p className='text-xs text-red-400 mt-1'>{(errors as any).terms}</p>
          )}
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
          <UserPlus className='h-4 w-4 mr-2' />
          Create account
        </button>
      </form>
    </AuthCard>
  );
}
