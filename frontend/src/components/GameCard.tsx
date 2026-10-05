import { Link } from "react-router";
import type { Game } from "../types/game";

type GameCardProps = { game: Game }

export function GameCard({ game }: GameCardProps) {
    return (
        <article className="task-card">
            <h2>
                <Link to={`/games/${game.id}`}>{game.title}</Link>
            </h2>
            <p>{game.description}</p>
            <p>Статус прохождения: {game.status}</p>
        </article>
    )

}