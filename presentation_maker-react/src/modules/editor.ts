import type { Presentation } from "../../../types/presentation.js";

let currentPresentation:Presentation | null = null

function setInitialState(presentation: Presentation): void {
    currentPresentation = presentation
}

function getState(): Presentation| null {
    return currentPresentation
}

type Modifier<P = any> = (model: Presentation, params: P) => Presentation;

let modifierParams: any = null;

function dispatch(modifier: Modifier, params: any = null): void {
  if (!currentPresentation) {
    console.error('State is not initialized! Call setInitialState first.');
    return;
  }

  modifierParams = params;
  currentPresentation = modifier(currentPresentation, params);

  if (editorChangeHandler) {
    editorChangeHandler();
  }
}

let editorChangeHandler: (() => void) | null = null

function addEditorChangeHandler(handler: () => void): void {
    editorChangeHandler = handler
}


export {
    dispatch,
    setInitialState,
    getState,
    addEditorChangeHandler
}