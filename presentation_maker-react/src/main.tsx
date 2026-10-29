import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { setInitialState, addEditorChangeHandler } from './modules/editor';
import { createTestPresentation } from './data/data';
import { addLangChangeHandler } from './services/LanguageChoose/i18n';
import "./index.css"

setInitialState(createTestPresentation());

const root = ReactDOM.createRoot(document.getElementById('root')!);

function render() {
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

addEditorChangeHandler(render);
addLangChangeHandler(render);
render();