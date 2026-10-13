import { useState } from 'react'
import type { FormEvent } from 'react'
import type { GameDraft, GameStatus } from '../types/game'

type GameFormProps = {
    initialValues: GameDraft
    onSave: (draft: GameDraft) => void
    onCancel: () => void
}

export function GameForm(props: GameFormProps) {
    const [draft, setDraft] = useState<GameDraft>(() => ({
        ...props.initialValues,
    }))
    const [error, setError] = useState('')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const title = draft.title.trim()
        const description = draft.description.trim()
        const tag = draft.tag.trim()

        if (title.length < 3 || title.length > 100) {
            setError('Название должно содержать от 3 до 100 символов.')
            return
        }

        if (!description) {
            setError('Введите описание игры.')
            return
        }

        if (!tag) {
            setError('Укажите тег игры.')
            return
        }

        setError('')

        props.onSave({
            ...draft,
            title,
            description,
            tag,
        })
    }

    function handleStatusChange(status: GameStatus) {
        setDraft({ ...draft, status })
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="game-title">Название</label>
            <input
                id="game-title"
                value={draft.title}
                required
                onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                }
            />

            <label htmlFor="game-description">Описание</label>
            <textarea
                id="game-description"
                value={draft.description}
                required
                onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                }
            />

            <label htmlFor="game-tag">Тег</label>
            <input
                id="game-tag"
                value={draft.tag}
                required
                onChange={(e) =>
                    setDraft({ ...draft, tag: e.target.value })
                }
            />

            <label htmlFor="game-status">Статус</label>
            <select
                id="game-status"
                value={draft.status}
                onChange={(e) =>
                    handleStatusChange(e.target.value as GameStatus)
                }
            >
                <option value="todo">Запланировано</option>
                <option value="in_progress">В процессе</option>
                <option value="done">Пройдено</option>
            </select>

            {error && <p role="alert">{error}</p>}

            <button type="submit">Сохранить</button>
            <button type="button" onClick={props.onCancel}>
                Отмена
            </button>
        </form>
    )
}
