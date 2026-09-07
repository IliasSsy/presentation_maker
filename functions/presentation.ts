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
    if (
        typeof presentation.id !== 'string' ||
        typeof presentation.name !== 'string' ||
        !['access', 'public', 'linkedOnly'].includes(presentation.access) ||
        typeof presentation.created !== 'string' ||
        !Array.isArray(presentation.slides) ||
        typeof presentation.activeSlideId !== 'string'
    ) {
        throw new Error('Invalid presentation');
    }
    return {
        ...presentation,
        created: new Date(presentation.created)
    }
}

function updatePresentationAccess(presentation: Presentation, access: "private" | "public" | "linkedOnly"): Presentation {
    return {
        ...presentation,
        access
    };
}

export {
    createPresentation,
    updatePresentationName,
    savePresentation,
    loadPresentation,
    updatePresentationAccess
};