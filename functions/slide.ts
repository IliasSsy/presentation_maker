import type { Presentation } from "../types/presentation.js";
import type { Slide as Slide } from "../types/slide.js";

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
    const name:string = slideName ?? `Слайд ${presentation.slides.length + 1}`;
    const newSlide:Slide = createDefaultSlide(slideId, name);
    return {
        ...presentation,
        slides: [...presentation.slides, newSlide],
    };
}

function removeSlide(presentation: Presentation, id: string): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.filter(slide => slide.id !== id)
    }
}

function moveSlide(presentation: Presentation, slideId: string, newIndex: number): Presentation {
    const targetSlide = presentation.slides.find(slide => slide.id === slideId);
    if (!targetSlide) return presentation;
    const otherSlides = presentation.slides.filter(slide => slide.id !== slideId);
    return {
        ...presentation,
        slides: [
            ...otherSlides.slice(0, newIndex),
            targetSlide,
            ...otherSlides.slice(newIndex)
        ]
    };
}


function duplicateSlide(presentation: Presentation, slide: Slide, newSlideId: string): Presentation {
    if (!slide) {
        return presentation;
    }
    const index:number = presentation.slides.findIndex(item => item.id === slide.id);
    if (index === -1) {
        return presentation;
    }
    const originalSlide = presentation.slides[index]
    const cloneSlide = structuredClone(originalSlide)
    cloneSlide.id = newSlideId
    return {
        ...presentation,
        slides: [
            ...presentation.slides.slice(0, index + 1),
            cloneSlide,
            ...presentation.slides.slice(index + 1)
        ]
    };
}

export {
    createDefaultSlide,
    duplicateSlide,
    moveSlide,
    addSlide,
    removeSlide
}