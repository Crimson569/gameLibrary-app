import './App.css'
const appTitle: string = 'Game Library'
export default function App() {
 return (
 <main className="app">
 <header>
 <h1>{appTitle}</h1>
 <p>Личный каталог игр для хранения платформ и отслеживания прогресса прохождения.</p>
 </header>
 <section aria-labelledby="items-title">
 <h2 id="items-title">Мои игры</h2>
 <p>Здесь появится список игр с указанием платформы и текущего статуса прохождения.</p>
 </section>
 </main>
 )
}