import type { Background } from "../../../../../../types/slide";

function getSlideBackground(background?: Background): string {
    if (!background) return '#ffffff';

    if (background.type === 'color') {
        return background.color;
    } 
    if (background.type === 'image') {
        return `url(${background.url}) center/cover no-repeat`;
    } 
    if (background.type === 'gradient') {
        return `linear-gradient(${background.angle}deg, ${background.colors.join(', ')})`;
    }

    return '#ffffff';
}

export {getSlideBackground}