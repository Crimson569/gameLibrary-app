import { Link, useNavigate, useParams } from "react-router";
import type { Game } from "../types/game";

type GameDetailsPageProps = {
    games: Game[]
    onDelete: (id: string) => void
}

export function GameDetailsPage({ games, onDelete }: GameDetailsPageProps) {
    const { id } = useParams()
    const game = games.find((item) => item.id === id)
    const navigate = useNavigate()
    if (!game) {
        return (
            <section>
                <h1>Игра не найдена</h1>
                <Link to="/games">К списку игр</Link>
            </section>
        )
    }
    return (
        <section>
            <h1>{game.title}</h1>
            <p>{game.description}</p>
            <p>Статус прохождения: {game.status}</p>
            <Link to="/games/:id/edit">Редактирование</Link>
            <button type="button" onClick={() => {
                if (window.confirm(`Удалить игру "${game.title}"`)) {
                    onDelete(game.id)
                    navigate('/games', { replace: true })
                }

            }}>
                Удалить
            </button>
            <Link to="/games">К списку задач</Link>
        </section>
    )
}