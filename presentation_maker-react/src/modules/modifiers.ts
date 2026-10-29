import type { EditorState } from "./editor";
import type { Slide } from "../../../types/slide";
import type { Point } from "../../../types/objects";
import { generateId } from "../../../functions/utils";
import { removeObject, moveObject, resizeObject } from "../../../functions/objects";

function changePresentationTitle(state: EditorState, newName: string): EditorState {
    return {
        ...state,
        presentation: {
            ...state.presentation,
            name: newName
        }
    };
}

function setPreviewModeModifier(state: EditorState, mode: boolean): EditorState {
    return {
        ...state,
        isPreviewMode: mode
    }
}

function setActiveSlide(state: EditorState, slideId: string): EditorState {
    return {
        ...state,
        activeSlideId: slideId
    };
}

function nextSlideModifier(state: EditorState): EditorState {
    const slides = state.presentation.slides;
    let currentIndex = slides.findIndex(slide => slide.id === state.activeSlideId);
    if (currentIndex === -1) {
        currentIndex = 0;
    }

    if (currentIndex < slides.length - 1) {
        return {
            ...state,
            activeSlideId: slides[currentIndex + 1].id
        };
    }
    return state;
}

function prevSlideModifier(state: EditorState): EditorState {
    const slides = state.presentation.slides;
    let currentIndex = slides.findIndex(slide => slide.id === state.activeSlideId);
    if (currentIndex === -1) {
        currentIndex = 0;
    }
    if (currentIndex > 0) {
        return {
            ...state,
            activeSlideId: slides[currentIndex - 1].id
        };
    }
    return state;
}

function startPreviewModifier(state: EditorState): EditorState {
    const firstSlideId = state.presentation.slides[0]?.id || state.activeSlideId;
    return {
        ...state,
        activeSlideId: firstSlideId,
        isPreviewMode: true,
    };
}

function addSlideModifier(state: EditorState): EditorState {
    const newSlide: Slide = {
        id: generateId(),
        number: state.presentation.slides.length + 1,
        elements: [],
        notice: "",
        background: { type: 'solid', color: '#ffffff' }
    };
    return {
        ...state,
        presentation: {
            ...state.presentation,
            slides: [...state.presentation.slides, newSlide]
        },
        activeSlideId: newSlide.id 
    };
}

function deleteSlideModifier(state: EditorState, slideId: string): EditorState {
    if (state.presentation.slides.length <= 1) {
        return state;
    }
    const newSlides = state.presentation.slides.filter(slide => slide.id !== slideId);
    let newActiveId = state.activeSlideId;
    if (state.activeSlideId === slideId) {
        newActiveId = newSlides[0].id;
    }

    return {
        ...state,
        presentation: {
            ...state.presentation,
            slides: newSlides
        },
        activeSlideId: newActiveId
    };
}

function moveSelectedObjectsModifier(state: EditorState, activeSlideId: string, moveIds: string[], delta: Point): EditorState {
    return {
        ...state,
        presentation: {
            ...state.presentation,
            slides: state.presentation.slides.map(slide => {
                if (slide.id !== activeSlideId) return slide;
                const updatedSlide = moveIds.reduce((currentSlide, id) => {
                    const obj = currentSlide.elements.find(e => e.id === id);
                    if (!obj) return currentSlide;
                    return moveObject(currentSlide, id, obj.position.x + delta.x, obj.position.y + delta.y);
                }, slide);

                return updatedSlide;
            })
        }
    };
}

function removeSelectedObjectsModifier(state: EditorState, selectObjectIds: string[]): EditorState {
    const slideIndex = state.presentation.slides.findIndex(s => s.id === state.activeSlideId)
    if (slideIndex == -1) {
        return state;
    }
    let updatedSlide = state.presentation.slides[slideIndex]
    selectObjectIds.forEach(id => {
        updatedSlide = removeObject(updatedSlide, id)
    })
    const newSlides = [...state.presentation.slides];
    newSlides[slideIndex] = updatedSlide
    return {
        ...state,
        presentation: {
            ...state.presentation,
            slides: newSlides
        }
    }
}

export {
    deleteSlideModifier,
    addSlideModifier,
    setActiveSlide,
    changePresentationTitle,
    startPreviewModifier,
    prevSlideModifier,
    nextSlideModifier,
    setPreviewModeModifier,
    removeSelectedObjectsModifier,
    moveSelectedObjectsModifier
};