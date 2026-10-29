import type { Presentation } from "../../../types/presentation.js";
import type { Background } from "../../../types/slide.js";

type EditorState = {
  presentation: Presentation;
  activeSlideId: string;
  isPreviewMode: boolean;
};

let currentState: EditorState | null = null;

function setInitialState(presentation: Presentation): void {
    currentState = {
        presentation,
        activeSlideId: presentation.slides[0]?.id || '',
        isPreviewMode: false
    };
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

  currentState = modifier(currentState, ...args);

  if (editorChangeHandler) {
    editorChangeHandler();
  }
}

function getPreviewMode(): boolean {
  return currentState ? currentState.isPreviewMode : false;
}

let editorChangeHandler: (() => void) | null = null;

function addEditorChangeHandler(handler: () => void): void {
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
    addEditorChangeHandler,
    getPreviewMode,
    getBackgroundStyle,
};

export type {
  EditorState
}