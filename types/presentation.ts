import type { Slide as Slide } from './slide.ts';

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