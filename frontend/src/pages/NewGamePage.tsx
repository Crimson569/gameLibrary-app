import { useNavigate } from 'react-router'
import type { GameDraft } from '../types/game'
import { GameForm } from '../components/GameForm'

type NewGamePageProps = {
    onCreate: (draft: GameDraft) => Promise<string>
}

const emptyGame: GameDraft = {
    title: '',
    description: '',
    status: 'unplayed',
    genre: '',
}

export function NewGamePage({ onCreate }: NewGamePageProps) {
    const navigate = useNavigate()

    async function handleSave(draft: GameDraft): Promise<void> {
        const id = await onCreate(draft)
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