import type { Presentation } from "../types/presentation.js";
import type { Slide } from "../types/slide.js";

function createPresentation(name: string, id: string, created: Date): Presentation {
    return {
        id,
        slides: [],
        name,
        access: 'linkedOnly',
        created,
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

function loadPresentation(json: string): Presentation | null {
    try {
        const presentation = JSON.parse(json);
        if (
            typeof presentation.id !== 'string' ||
            typeof presentation.name !== 'string' ||
            !['private', 'public', 'linkedOnly'].includes(presentation.access) ||
            typeof presentation.created !== 'string' ||
            !Array.isArray(presentation.slides)
        ) {
            return null;
        }
        return {
            ...presentation,
            created: new Date(presentation.created)
        }
    } catch {
        return null;
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