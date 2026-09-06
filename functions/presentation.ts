import type { Presentation as Presentation } from "../types/presentation.js";
import type { Slide as Slide } from "../types/slide.js";
import { generateId } from "./utils.js"
import { createDefaultSlide } from "./slide.js";

const id:string = generateId();
const defaultSlide:Slide = createDefaultSlide(id);
const created:Date = new Date();

function createPresentation(name: string, defaultSlide: Slide, id: string, created: Date): Presentation {
    return {
        id,
        slides: [defaultSlide],
        name,
        access: 'linkedOnly',
        created,
        activeSlideId: defaultSlide.id,
    }
}

function updatePresentationName(name: string, presentation: Presentation): Presentation {
    return {
        ...presentation,
        name,
    }
}

function savePresentation(presentation: Presentation): string {
    return JSON.stringify(presentation, null, 2)
}

function loadPresentation(json: string): Presentation {
    const presentation = JSON.parse(json);
    return {
        ...presentation,
        created: new Date(presentation.created)
    }
}

export {
    createPresentation,
    updatePresentationName,
    savePresentation,
    loadPresentation,
};