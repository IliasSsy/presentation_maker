import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { addEditorChangeHandler, setInitialState } from './modules/editor.js';
import { createTestPresentation } from './data/data.js';

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