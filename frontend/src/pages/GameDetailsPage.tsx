import { Link, useParams } from "react-router";
import { games } from "../data/games";

export function GameDetailsPage() {
    const { id } = useParams()
    const game = games.find((item) => item.id === id)
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
            <Link to="/games">К списку задач</Link>
        </section>
    )
}