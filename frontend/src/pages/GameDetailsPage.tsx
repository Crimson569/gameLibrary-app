import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Game } from "../types/game";

type GameDetailsPageProps = {
    games: Game[]
    onDelete: (id: string) => Promise<void>
}

export function GameDetailsPage({ games, onDelete }: GameDetailsPageProps) {
    const { id } = useParams()
    const game = games.find((item) => item.id === id)
    const navigate = useNavigate()
    const [pending, setPending] = useState(false)
    const [deleteError, setDeleteError] = useState('')

    if (!game) {
        return (
            <section>
                <h1>Игра не найдена</h1>
                <Link to="/games">К списку игр</Link>
            </section>
        )
    }

    async function handleDelete(gameToDelete: Game): Promise<void> {
        if (pending) return
        if (!window.confirm(`Удалить игру "${gameToDelete.title}"`)) return

        setPending(true)
        setDeleteError('')
        try {
            await onDelete(gameToDelete.id)
            navigate('/games', { replace: true })
        } catch (err: unknown) {
            setDeleteError(err instanceof Error ? err.message : 'Не удалось удалить игру.')
        } finally {
            setPending(false)
        }
    }

    return (
        <section>
            <h1>{game.title}</h1>
            <p>{game.description}</p>
            <p>Статус прохождения: {game.status}</p>
            <Link to={`/games/${game.id}/edit`}>Редактирование</Link>
            <button type="button" onClick={() => handleDelete(game)} disabled={pending}>
                {pending ? 'Удаляем…' : deleteError ? 'Повторить удаление' : 'Удалить'}
            </button>
            {deleteError && <p role="alert">{deleteError}</p>}
            <Link to="/games">К списку игр</Link>
        </section>
    )
}