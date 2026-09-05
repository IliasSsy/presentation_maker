import type { Slide as Slide } from './slide.ts';

type Presentation = {
    id: string;
    name: string;
    secure: "access" | "public" | "linkedOnly";
    created: Date;
    slides: Slide[];
    activeSlideId: string;
}

export { 
    type Presentation 
}