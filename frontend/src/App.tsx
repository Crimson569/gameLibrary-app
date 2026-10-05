import { Navigate, Routes, Route } from 'react-router'
import './App.css'
import AppLayout from './app/AppLayout'
import { NotFoundPage } from './pages/NotFoundPage'
import { GameDetailsPage } from './pages/GameDetailsPage'
import { NewGamePage } from './pages/NewGamePage'
import { GamesPage } from './pages/GamesPage'
export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/games" replace />} />
                <Route path="games" element={<GamesPage />} />
                <Route path="games/new" element={<NewGamePage />} />
                <Route path="games/:id" element={<GameDetailsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}