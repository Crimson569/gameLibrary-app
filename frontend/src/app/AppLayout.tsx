import { useState } from 'react'
import { NavLink, Outlet } from "react-router"
import type { AuthState } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export default function AppLayout({ auth }: { auth: AuthState }) {
    const [signingOut, setSigningOut] = useState(false)
    const [signOutError, setSignOutError] = useState('')

    async function handleSignOut(): Promise<void> {
        setSignOutError('')
        setSigningOut(true)
        try {
            const { error } = await supabase.auth.signOut({ scope: 'local' })
            if (error) throw error
        } catch (err: unknown) {
            setSignOutError(err instanceof Error ? err.message : 'Не удалось выйти.')
        } finally {
            setSigningOut(false)
        }
    }

    return (
        <div className="app">
            <header>
                <h1>GamesLibrary</h1>
                <p>Личный каталог игр для хранения платформ и отслеживания прогресса прохождения.</p>
                <nav aria-label="Основная навигация">
                    <NavLink to="/games" end>Игры</NavLink>
                    <NavLink to="/games/new">Добавить</NavLink>
                </nav>
                {auth.status === 'authenticated' && (
                    <div>
                        <span>{auth.session.user.email}</span>
                        <button type="button" onClick={handleSignOut} disabled={signingOut}>
                            {signingOut ? 'Выходим…' : 'Выйти'}
                        </button>
                    </div>
                )}
                {signOutError && <p role="alert">{signOutError}</p>}
            </header>
            <section aria-labelledby="items-title">
                <h2 id="items-title">Мои игры</h2>
                <p>Здесь появится список игр с указанием платформы и текущего статуса прохождения.</p>
            </section>
            <main><Outlet /></main>
        </div>
    )
}