import { Link } from 'react-router'
import { GameCard } from '../components/GameCard'
// import type { Game, GameStatus } from '../types/game'
// import { useState } from 'react'
import type { Game } from '../types/game'

type GamesPageProps = { games: Game[] }

export function GamesPage({ games }: GamesPageProps) {
    // const [status, setStatus] = useState<GameStatus | 'all'>('all')
    // const visibleGames = games.filter((game) => 
    //     status === 'all' || game.status === status
    // )
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