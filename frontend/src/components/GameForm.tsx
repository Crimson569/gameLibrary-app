import { useState } from 'react'
import type { FormEvent } from 'react'
import type { GameDraft, GameStatus } from '../types/game'
import { useTags } from '../hooks/useTags'

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

    const { load, retry } = useTags()
    const tags = load.status === 'success' ? load.data : []
    const selectedTagExists = tags.some((tag) => tag.id === draft.tag)
    const canSave = load.status === 'success' && selectedTagExists

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!canSave) {
            setError('Дождитесь справочника и выберите доступный тег.')
            return
        }

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

            <label htmlFor="task-tag">Тег</label>
            <select id="task-tag" value={draft.tag} required
                disabled={load.status !== 'success' || tags.length === 0}
                onChange={(event) => setDraft({
                    ...draft, tag: event.target.value,
                })}>
                <option value="">Выберите тег</option>
                {draft.tag !== '' && !selectedTagExists && (
                    <option value={draft.tag} disabled>
                        Текущий код: {draft.tag} — выберите доступный тег
                    </option>
                )}
                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
            </select>
            {load.status === 'loading' && (
                <p role="status">Загружаем теги…</p>
            )}
            {load.status === 'error' && (
                <div>
                    <p role="alert">{load.message}</p>
                    <button type="button" onClick={retry}>Повторить</button>
                </div>
            )}
            {load.status === 'success' && tags.length === 0 && (
                <div>
                    <p role="status">Тегов пока нет. Сохранение недоступно.</p>
                    <button type="button" onClick={retry}>Повторить</button>
                </div>
            )}

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

            <button type="submit" disabled={!canSave}>Сохранить</button>
            <button type="button" onClick={props.onCancel}>Отмена</button>
        </form>
    )
}
