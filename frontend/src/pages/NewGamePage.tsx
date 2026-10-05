import { Link } from 'react-router'

export function NewGamePage() {
    return(
        <>
            <h1>Добавление игры</h1>
            <Link to="/games">К списку игр</Link>
        </>
    )
}

