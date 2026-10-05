export type GameStatus = 'in_progress' | 'complete' | 'unplayed'
export type Game = {
 id: string
 title: string
 description: string
 status: GameStatus
 tag: string
}
