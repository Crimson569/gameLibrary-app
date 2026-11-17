import { Navigate, Outlet, Routes, Route } from 'react-router'
import './App.css'
import AppLayout from './app/AppLayout'
import { NotFoundPage } from './pages/NotFoundPage'
import { GameDetailsPage } from './pages/GameDetailsPage'
import { NewGamePage } from './pages/NewGamePage'
import { GamesPage } from './pages/GamesPage'
import { useState, useEffect } from 'react'
import type { Game, GameDraft } from './types/game'
import { EditGamePage } from './pages/EditGamePage'
import { useAuth } from './hooks/useAuth'
import AuthPage from './pages/AuthPage'
import { RequireAuth } from './auth/RequireAuth'
import { getGames, createGame as createGameRequest, updateGame as updateGameRequest, deleteGame as deleteGameRequest } from './services/games'

export default function App() {
    const auth = useAuth()
    const userId = auth.status === 'authenticated' ? auth.session.user.id : null

    const [games, setGames] = useState<Game[]>([])
    const [loadedFor, setLoadedFor] = useState<string | null>(null)
    const [loadError, setLoadError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

    const loading = userId !== null && loadedFor !== userId && loadError === ''

    useEffect(() => {
        // при выходе или смене пользователя старый список очищается до нового запроса
        setGames([])
        setLoadedFor(null)
        setLoadError('')
        if (userId === null) return

        let active = true
        getGames()
            .then((list) => {
                if (!active) return
                setGames(list)
                setLoadedFor(userId)
            })
            .catch((err: unknown) => {
                if (!active) return
                setLoadError(err instanceof Error ? err.message : 'Не удалось загрузить игры.')
            })
        return () => { active = false }
    }, [userId, reloadKey])

    async function createGame(draft: GameDraft): Promise<string> {
        const created = await createGameRequest(draft)
        try {
            setGames(await getGames())
        } catch {
            setGames((current) => [created, ...current])
        }
        return created.id
    }

    async function updateGame(id: string, draft: GameDraft): Promise<void> {
    await updateGameRequest(id, draft)
    try {
        setGames(await getGames())
    } catch {
        // изменение уже сохранено, поэтому ошибку повторной загрузки не пробрасываем
        setGames((current) => current.map((game) =>
            game.id === id ? { ...draft, id: game.id } : game
        ))
    }
}

    async function deleteGame(id: string): Promise<void> {
    await deleteGameRequest(id)
    try {
        setGames(await getGames())
    } catch {
        setGames((current) => current.filter((game) => game.id !== id))
    }
}

    const gate = loading
        ? <p role="status">Загружаем игры…</p>
        : loadError
            ? (
                <div role="alert">
                    <p>{loadError}</p>
                    <button type="button" onClick={() => setReloadKey((k) => k + 1)}>
                        Повторить
                    </button>
                </div>
            )
            : <Outlet />

    return (
        <Routes>
            <Route element={<AppLayout auth={auth} />}>
                <Route index element={<Navigate to="/games" replace />} />
                <Route
                    path="auth"
                    element={auth.status === 'authenticated'
                        ? <Navigate to="/games" replace />
                        : <AuthPage />}
                />
                <Route element={<RequireAuth auth={auth} />}>
                    <Route element={gate}>
                        <Route path="games" element={<GamesPage games={games} />} />
                        <Route path="games/new" element={<NewGamePage onCreate={createGame} />} />
                        <Route path="games/:id" element={<GameDetailsPage games={games} onDelete={deleteGame} />} />
                        <Route path="games/:id/edit" element={<EditGamePage games={games} onUpdate={updateGame} />} />
                    </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}