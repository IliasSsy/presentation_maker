import type { Presentation } from "../../../types/presentation";
import type { Slide } from "../../../types/slide";
import { generateId } from "../../../functions/utils";

function changePresentationTitle(presentation: Presentation, newName: string): Presentation {
    return {
        ...presentation,
        name: newName
    };
}

function setActiveSlide(presentation: Presentation, slideId: string): Presentation {
    return {
        ...presentation,
        activeSlideId: slideId
    };
}

function addSlideModifier(presentation: Presentation): Presentation {
    const newSlide: Slide = {
        id: generateId(),
        name: `Слайд ${presentation.slides.length + 1}`,
        number: presentation.slides.length + 1,
        elements: [],
        notice: "",
        background: { type: 'solid', color: '#ffffff' }
    };
    return {
        ...presentation,
        slides: [...presentation.slides, newSlide],
        activeSlideId: newSlide.id 
    };
}

function deleteSlideModifier(presentation: Presentation, slideId: string): Presentation {
    if (presentation.slides.length <= 1) {
        return presentation;
    }

    const newSlides = presentation.slides.filter(slide => slide.id !== slideId);
    
    let newActiveId = presentation.activeSlideId;
    if (presentation.activeSlideId === slideId) {
        newActiveId = newSlides[0].id;
    }

    return {
        ...presentation,
        slides: newSlides,
        activeSlideId: newActiveId
    };
}

export {
    deleteSlideModifier,
    addSlideModifier,
    setActiveSlide,
    changePresentationTitle
}