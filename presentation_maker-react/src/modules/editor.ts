import type { Presentation } from "../../../types/presentation.js";

type EditorState = {
  presentation: Presentation;
  activeSlideId: string;
  isPreviewMode: boolean;
};

let currentState: EditorState | null = null;
let past: EditorState[] = [];
let future: EditorState[] = [];

let editorChangeHandler: (() => void) | null = null;

function setInitialState(presentation: Presentation): void {
    currentState = {
        presentation,
        activeSlideId: presentation.slides[0]?.id || '',
        isPreviewMode: false
    };
    past = [];
    future = [];
}

function getState(): EditorState | null {
    return currentState;
}

type Modifier = (state: EditorState, ...args: any[]) => EditorState;

function dispatch(modifier: Modifier, ...args: any[]): void {
    if (!currentState) {
        console.error('State is not initialized! Call setInitialState first.');
        return;
    }

    past = [...past, currentState];
    future = [];

    currentState = modifier(currentState, ...args);

    if (editorChangeHandler) {
        editorChangeHandler();
    }
}

function undo(): void {
    if (past.length === 0 || !currentState) return;
    future = [currentState, ...future];
    const previous = past[past.length - 1];
    past = past.slice(0, -1);
    currentState = previous;
    if (editorChangeHandler) {
        editorChangeHandler();
    }
}

function redo(): void {
    if (future.length === 0 || !currentState) return;
    past = [...past, currentState];
    const next = future[0];
    future = future.slice(1);
    currentState = next;
    if (editorChangeHandler) {
        editorChangeHandler();
    }
}

function getCanUndo(): boolean {
    return past.length > 0;
}

function getCanRedo(): boolean {
    return future.length > 0;
}

function getPreviewMode(): boolean {
    return currentState ? currentState.isPreviewMode : false;
}

function addEditorChangeHandler(handler: () => void): void {
    editorChangeHandler = handler;
}

export {
    dispatch,
    setInitialState,
    getState,
    addEditorChangeHandler,
    getPreviewMode,
    undo,
    redo,
    getCanUndo,
    getCanRedo,
};

export type {
    EditorState
}