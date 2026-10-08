import type { Presentation } from "../../../types/presentation.js";
// презентацию + actionId тут
let currentPresentation: Presentation | null = null;

function setInitialState(presentation: Presentation): void {
    currentPresentation = presentation;
}

function getState(): Presentation | null {
    return currentPresentation;
}

type Modifier = (model: Presentation, ...args: any[]) => Presentation;

function dispatch(modifier: Modifier, ...args: any[]): void {
  if (!currentPresentation) {
    console.error('State is not initialized! Call setInitialState first.');
    return;
  }

  currentPresentation = modifier(currentPresentation, ...args);

  if (editorChangeHandler) {
    editorChangeHandler();
  }
}

let editorChangeHandler: (() => void) | null = null;

function addEditorChangeHandler(handler: () => void): void {
    editorChangeHandler = handler;
}

export {
    dispatch,
    setInitialState,
    getState,
    addEditorChangeHandler
};