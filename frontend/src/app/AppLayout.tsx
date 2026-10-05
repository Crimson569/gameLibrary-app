import { NavLink, Outlet } from "react-router";

export default function AppLayout() {
    return (
        <div className="app">
            <header>
                <h1>GamesLibrary</h1>
                <p>Личный каталог игр для хранения платформ и отслеживания прогресса прохождения.</p>
                <nav aria-label="Основная навигация">
                    <NavLink to="/games" end>Игры</NavLink>
                    <NavLink to="/games/new">Добавить</NavLink>
                </nav>
            </header>
            <section aria-labelledby="items-title">
                <h2 id="items-title">Мои игры</h2>
                <p>Здесь появится список игр с указанием платформы и текущего статуса прохождения.</p>
            </section>
            <main><Outlet /></main>
        </div>
    )
}