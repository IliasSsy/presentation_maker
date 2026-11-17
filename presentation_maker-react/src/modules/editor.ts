import type { Presentation } from "../../../types/presentation.js";
import type { Background } from "../../../types/slide.js";

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

function getHistoryState(): { canUndo: boolean; canRedo: boolean } {
    return {
        canUndo: past.length > 0,
        canRedo: future.length > 0,
    };
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

function getPreviewMode(): boolean {
    return currentState ? currentState.isPreviewMode : false;
}

function setPreviewMode(mode: boolean): void {
    if (!currentState) return;
    currentState = {
        ...currentState,
        isPreviewMode: mode
    };
    if (editorChangeHandler) {
        editorChangeHandler();
    }
}

function addEditorChangeHandler(handler: (() => void) | null): void {
    editorChangeHandler = handler;
}

function getBackgroundStyle(background?: Background): React.CSSProperties {
    if (!background || background.type === 'none') {
        return { backgroundColor: '#ffffff' };
    }
    if (background.type === 'color' || background.type === 'solid') {
        return { backgroundColor: background.color };
    }
    if (background.type === 'image') {
        return { backgroundImage: `url(${background.url})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    if (background.type === 'gradient') {
        return { background: `linear-gradient(${background.angle}deg, ${background.colors.join(', ')})` };
    }
    return { backgroundColor: '#ffffff' };
}

export {
    dispatch,
    setInitialState,
    getState,
    getHistoryState,
    addEditorChangeHandler,
    getPreviewMode,
    setPreviewMode,
    undo,
    redo,
    getBackgroundStyle,
};

export type {
    EditorState
};