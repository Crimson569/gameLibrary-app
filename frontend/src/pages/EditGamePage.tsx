import { Link, useNavigate, useParams } from 'react-router'
import type { GameDraft } from '../types/game'
import { GameForm } from '../components/GameForm'
import type { Game } from '../types/game'

type EditGamePageProps = {
    games: Game[]
    onUpdate: (id: string, draft: GameDraft) => Promise<void>
}

export function EditGamePage({ games, onUpdate }: EditGamePageProps) {
    const { id } = useParams()
    const navigate = useNavigate()
    const game = games.find((game) => game.id === id)
    if (!game) {
        return (
            <section><h1>Игра не найдена</h1>
                <Link to="/games">К списку</Link></section>
        )
    }
    const initialValue: GameDraft = {
        title: game.title, description: game.description,
        status: game.status, genre: game.genre
    }
    return (
        <section>
            <h1>Редактирование игры</h1>
            <GameForm key={game.id}
                initialValues={initialValue}
                onSave={async (draft) => {
                    await onUpdate(game.id, draft)
                    navigate(`/games/${game.id}`)
                }}
                onCancel={() => navigate(`/games/${game.id}`)} />
        </section>
    )

}