import { useState } from 'react'
import { Link } from 'react-router'
import { GameCard } from '../components/GameCard'
import type { Game, GameStatus } from '../types/game'

type GamesPageProps = { games: Game[] }

type StatusFilter = GameStatus | 'all'

const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'unplayed', label: 'Запланировано' },
    { value: 'in_progress', label: 'В процессе' },
    { value: 'complete', label: 'Пройдено' },
]

function isStatusFilter(value: string): value is StatusFilter {
    return statusOptions.some((option) => option.value === value)
}

export function GamesPage({ games }: GamesPageProps) {
    const [status, setStatus] = useState<StatusFilter>('all')

    const visibleGames = games.filter((game) =>
        status === 'all' || game.status === status
    )

    return (
        <section>
            <h1>Мои игры</h1>
            <Link to="/games/new">Добавить игру</Link>

            <select
                value={status}
                onChange={(event) => {
                    const value = event.target.value
                    if (isStatusFilter(value)) {
                        setStatus(value)
                    }
                }}
            >
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <button type="button" onClick={() => setStatus('all')}>
                Сбросить фильтр
            </button>

            {games.length === 0 ? (
                <p>Игр пока нет.</p>
            ) : visibleGames.length === 0 ? (
                <p>Нет игр с выбранным статусом.</p>
            ) : (
                <div className="task-list">
                    {visibleGames.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            )}
        </section>
    )
}