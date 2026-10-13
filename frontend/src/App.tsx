import { Navigate, Routes, Route } from 'react-router'
import './App.css'
import AppLayout from './app/AppLayout'
import { NotFoundPage } from './pages/NotFoundPage'
import { GameDetailsPage } from './pages/GameDetailsPage'
import { NewGamePage } from './pages/NewGamePage'
import { GamesPage } from './pages/GamesPage'
import { useState } from 'react'
import { initialGames } from './data/games'
import type  { Game, GameDraft } from './types/game'
import { EditGamePage } from './pages/EditGamePage'
export default function App() {
    const [games, setGames] = useState<Game[]>(() =>
        initialGames.map((game) => ({ ...game }))
    );

    function createGame(draft: GameDraft): string {
        const id = crypto.randomUUID()
        setGames((current) => [...current, { ...draft, id }])
        return id
    }

    function updateGame(id: string, draft: GameDraft): void {
        setGames((current) => current.map((game) =>
            game.id === id ? { ...draft, id: game.id } : game
        ))
    }

    function deleteGame(id: string): void {
        setGames((current) => current.filter((game) => game.id !== id))
    }

    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/games" replace />} />
                <Route path="games" element={<GamesPage games={games} />} />
                <Route path="games/new" element={<NewGamePage onCreate={createGame} />} />
                <Route path="games/:id" element={<GameDetailsPage games={games} onDelete={deleteGame} />} />
                <Route path="games/:id/delete" element={<EditGamePage games={games} onUpdate={updateGame} />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}