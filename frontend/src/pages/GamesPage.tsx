import { Link } from 'react-router'
import { GameCard } from '../components/GameCard'
import { games } from '../data/games'

export function GamesPage() {
    return (
        <section>
            <h1>Мои игры</h1>
            <Link to="/games/new">Добавить игру</Link>
            {games.length === 0 ? (
                <p>Задач пока нет.</p>
            ) : (
                <div className="task-list">
                    {games.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            )}
        </section>
    )
}