import { useNavigate } from 'react-router'
import type { GameDraft } from '../types/game'
import { GameForm } from '../components/GameForm'

type NewGamePageProps = {
    onCreate: (draft: GameDraft) => string
}

const emptyGame: GameDraft = {
    title: '',
    description: '',
    status: 'unplayed',
    tag: '',
}

export function NewGamePage({ onCreate }: NewGamePageProps) {
    const navigate = useNavigate()

    function handleSave(draft: GameDraft) {
        const id = onCreate(draft)
        navigate(`/games/${id}`)
    }

    return (
        <section>
            <h1>Создание игры</h1>

            <GameForm
                initialValues={emptyGame}
                onSave={handleSave}
                onCancel={() => navigate('/games')}
            />
        </section>
    )
}