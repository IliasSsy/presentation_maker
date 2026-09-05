import type { SlideObject as SlideObject } from "./objects.ts";

type Slide = {
    id: string;
    name: string;
    number: number;
    elements: SlideObject[];
    notice: string;
    background: Background;
}

type SolidBackground = {
    type: 'solid',
    color: string,
}

type ImageBackground = {
    type: 'image',
    url: string,
}

type ColorBackground = {
    type: 'color',
    color: string,
}

type GradientBackground = {
    type: 'gradient',
    colors: string[],
    angle: number,
}

type DefaultBackground = {
    type: 'none';
}

type Background = SolidBackground | ImageBackground | ColorBackground | GradientBackground | DefaultBackground;

export { 
    type Slide,
    type Background,
}
