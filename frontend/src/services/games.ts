import type { Game } from "../types/game"
import type { GameDraft } from "../types/game"
import { supabase } from "../lib/supabase"

type GameRow = {
    id: string
    title: string
    description: string
    status: Game['status']
    genre: string
    created_at: string
}

const gameColumns = 'id, title, description, status, genre, created_at'

function fromRow(row: GameRow): Game {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        genre: row.genre
    }
}

function toWrite(draft: GameDraft) {
    return {
        title: draft.title.trim(),
        description: draft.description.trim(),
        status: draft.status,
        genre: draft.genre.trim(),
    }
}

export async function getGames(): Promise<Game[]> {
    const { data, error } = await supabase
        .from('games')
        .select(gameColumns)
        .order('created_at', { ascending: false })
        .overrideTypes<GameRow[], { merge: false }>()

    if (error) throw new Error(`Не удалось загрузить игры: ${error.message}`)

    return data.map(fromRow)
}

export async function createGame(draft: GameDraft): Promise<Game> {
    const { data, error } = await supabase
        .from('games')
        .insert(toWrite(draft))
        .select(gameColumns)
        .single()
        .overrideTypes<GameRow, { merge: false }>()

    if (error) throw new Error(`Не удалось создать игру: ${error.message}`)

    return fromRow(data)
}

export async function updateGame(
    id: string,
    draft: GameDraft,
): Promise<void> {
    const { error } = await supabase
        .from('games')
        .update(toWrite(draft))
        .eq('id', id)

    if (error) {
        throw new Error(`Не удалось изменить игру: ${error.message}`)
    }
}

export async function deleteGame(id: string): Promise<void> {
    const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(`Не удалось удалить игру: ${error.message}`)
    }
}