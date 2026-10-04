import { createTestPresentation } from "./data/data";
import { setInitialState, addEditorChangeHandler } from "./modules/editor";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const initialData = createTestPresentation();
setInitialState(initialData);

const root = createRoot(document.getElementById('root')!);

function renderApp(): void {
    root.render(<App />);
}

renderApp();

addEditorChangeHandler(() => {
    renderApp();
});