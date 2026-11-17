import { useState } from 'react'
import type { FormEvent } from 'react'
import type { GameDraft, GameStatus } from '../types/game'
import { useGenres } from '../hooks/useGenres'

type GameFormProps = {
    initialValues: GameDraft
    onSave: (draft: GameDraft) => Promise<void>
    onCancel: () => void
}

export function GameForm(props: GameFormProps) {
    const [pending, setPending] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const [draft, setDraft] = useState<GameDraft>(() => ({
        ...props.initialValues,
    }))

    const [error, setError] = useState('')

    const { load, retry } = useGenres()
    const genres = load.status === 'success' ? load.data : []
    const selectedGenreExists = genres.some((genre) => genre.id === draft.genre)
    const canSave = load.status === 'success' && selectedGenreExists

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (pending) return

        if (!canSave) {
            setError('Дождитесь справочника и выберите доступный жанр.')
            return
        }

        const title = draft.title.trim()
        const description = draft.description.trim()
        const genre = draft.genre.trim()

        if (title.length < 3 || title.length > 100) {
            setError('Название должно содержать от 3 до 100 символов.')
            return
        }

        if (!description) {
            setError('Введите описание игры.')
            return
        }

        if (!genre) {
            setError('Укажите жанр игры.')
            return
        }

        setError('')

        try {
            setPending(true)
            setSubmitError('')
            await props.onSave({ ...draft, title, description, genre })
        } catch (err: unknown) {
            setSubmitError(err instanceof Error ? err.message : 'Не удалось сохранить запись.')
        } finally {
            setPending(false)
        }
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

            <label htmlFor="game-genre">Жанр</label>
            <select id="game-genre" value={draft.genre} required
                disabled={load.status !== 'success' || genres.length === 0}
                onChange={(event) => setDraft({
                    ...draft, genre: event.target.value,
                })}>
                <option value="">Выберите жанр</option>
                {draft.genre !== '' && !selectedGenreExists && (
                    <option value={draft.genre} disabled>
                        Текущий код: {draft.genre} — выберите доступный жанр
                    </option>
                )}
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
            </select>
            {load.status === 'loading' && (
                <p role="status">Загружаем жанры…</p>
            )}
            {load.status === 'error' && (
                <div>
                    <p role="alert">{load.message}</p>
                    <button type="button" onClick={retry}>Повторить</button>
                </div>
            )}
            <button type="button" onClick={retry}
                disabled={load.status === 'loading'}>
                Обновить справочник
            </button>
            {load.status === 'success' && genres.length === 0 && (
                <div>
                    <p role="status">Жанров пока нет. Сохранение недоступно.</p>
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
            {submitError && <p role="alert">{submitError}</p>}

            <button type="submit" disabled={!canSave || pending}>
                {pending ? 'Сохраняем…' : submitError ? 'Повторить' : 'Сохранить'}
            </button>
            <button type="button" onClick={props.onCancel} disabled={pending}>Отмена</button>
        </form>
    )
}
