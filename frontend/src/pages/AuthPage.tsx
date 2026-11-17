import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'

type Mode = 'signin' | 'signup'

function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Пароль должен содержать не менее 8 символов.'
  }
  return null
}

export default function AuthPage() {
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [pending, setPending] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const isSignUp = mode === 'signup'

  function switchMode(nextMode: Mode): void {
    if (pending) return
    setMode(nextMode)
    setError('')
    setMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (pending) return

    setError('')
    setMessage('')

    if (isSignUp) {
      const passwordError = validatePassword(password)
      if (passwordError) {
        setError(passwordError)
        return
      }
    }

    setPending(true)
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        })
        if (error) throw error

        if (data.session) {
          navigate('/games', { replace: true })
        } else {
          setMessage('Проверьте почту и подтвердите регистрацию.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) throw error

        navigate('/games', { replace: true })
      }
    } catch (err: unknown) {
      // email не очищаем, показываем только сообщение Supabase
      setError(err instanceof Error ? err.message : 'Не удалось выполнить запрос.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main>
      <h1>{isSignUp ? 'Регистрация' : 'Вход'}</h1>

      <div role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={!isSignUp}
          disabled={pending}
          onClick={() => switchMode('signin')}
        >
          Вход
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isSignUp}
          disabled={pending}
          onClick={() => switchMode('signup')}
        >
          Регистрация
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            required
          />
        </label>

        <label>
          Пароль
          <input
            type="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
            required
          />
        </label>

        <button type="submit" disabled={pending}>
          {pending
            ? 'Подождите…'
            : isSignUp
              ? 'Зарегистрироваться'
              : 'Войти'}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
    </main>
  )
}