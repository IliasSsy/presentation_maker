import type { Presentation } from "../types/presentation.js";
import type { Slide as Slide } from "../types/slide.js";
import { generateId } from "./utils.js"

const id:string = generateId()

function createDefaultSlide(id: string, name?: string): Slide {
    return {
        id,
        name: name ?? 'Слайд 1',
        number: 1,
        background: { type: 'none' },
        elements: [],
        notice: 'Введите текст для заметок',
    }
}

function addSlide(presentation: Presentation, slideId: string, slideName?: string): Presentation {
    const name = slideName ?? `Слайд ${presentation.slides.length + 1}`;
    const newSlide = createDefaultSlide(slideId, name);
    return {
        ...presentation,
        slides: [...presentation.slides, newSlide],
        activeSlideId: presentation.activeSlideId === '' ? slideId : presentation.activeSlideId
    };
}

function removeSlide(presentation: Presentation, id: string): Presentation {
    const index = presentation.slides.findIndex(slide => slide.id === id);
    if (index === -1) {
        return presentation
    }
    let activeSlideId = presentation.activeSlideId;
    if (presentation.activeSlideId === id) {
        if (presentation.slides.length <= 1) {
            activeSlideId = '';
        } else if (index < presentation.slides.length - 1) {
            activeSlideId = presentation.slides[index + 1].id;
        } else {
            activeSlideId = presentation.slides[index - 1].id;
        }
    }
    return {
        ...presentation,
        slides: [...presentation.slides.slice(0, index), ...presentation.slides.slice(index + 1)],
        activeSlideId
    };
}

function moveSlide(presentation: Presentation, id: string, newPosition: number): Presentation {
    const index:number = presentation.slides.findIndex(slide => slide.id === id);
    const slide:Slide = presentation.slides[index];
    const newPresentation = removeSlide(presentation, id);
    return {
        ...newPresentation,
        slides: [...newPresentation.slides.slice(0, newPosition), slide, ...newPresentation.slides.slice(newPosition)]
    }
}

function setActiveSlide(presentation: Presentation, id: string): Presentation {
    return {
        ...presentation,
        activeSlideId: id
    }
}

function duplicateSlide(presentation: Presentation, slide: Slide): Presentation {
    const index = presentation.slides.findIndex(item => item.id === slide.id)
    return {
        ...presentation,
        slides: [...presentation.slides.slice(0, index), slide, ...presentation.slides.slice(index)]
    }
}

export {
    createDefaultSlide,
    duplicateSlide,
    setActiveSlide,
    moveSlide,
    addSlide,
    removeSlide
}