import type { Slide as Slide } from './slide.js';

type Presentation = {
    id: string;
    name: string;
    access: "private" | "public" | "linkedOnly";
    created: Date;
    slides: Slide[];
}

export { 
    type Presentation 
}