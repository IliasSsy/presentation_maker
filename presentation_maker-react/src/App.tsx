import { PlusButton } from "./components/Buttons/Plus_button/Plus_button"

function App() {
    return (
        <div>
            <h1>Мой перезентация</h1>
            <p>Проверяем плюсик:</p>

            <PlusButton onClick={() => alert('Плюс нажат!')} />
        </div>
    )
}

export {App};
