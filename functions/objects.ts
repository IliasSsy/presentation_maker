import type { Slide } from "../types/slide.js";
import type { TextObject, ImageObject, Size } from "../types/objects.js";
import type { SlideObject } from "../types/objects.js";

const DEAFULT_VALUE: number = 0;

function isValidImageUrl(url: string): boolean {
    const dot = url.lastIndexOf('.');
    if (dot === -1) {
        return false;
    }
    const format = url.slice(dot);
    const possibleArray = ['.png', '.img', '.jpg', '.jpeg', '.webp', '.gif'];
    return possibleArray.includes(format);
}

function modifyObject(slide: Slide, objectId: string, payload: Partial<SlideObject>): Slide {
    return {
        ...slide,
        elements: slide.elements.map(element => {
            if (element.id !== objectId) return element;
            return {
                ...element,
                ...payload,
            } as SlideObject;
        })
    };
}

function setSlideBackgroundColor(slide: Slide, color: string): Slide {
    if (!color) return slide;
    return { ...slide, background: { type: 'color', color } };
}

function setSlideBackgroundImage(slide: Slide, url: string): Slide {
    if (!isValidImageUrl(url)) return slide;
    return { ...slide, background: { type: 'image', url } };
}

function setSlideBackgroundGradient(slide: Slide, colors: string[], angle?: number): Slide {
    angle = angle ?? DEAFULT_VALUE;
    return { ...slide, background: { type: 'gradient', colors, angle } };
}

function clearSlideBackground(slide: Slide): Slide {
    return { ...slide, background: { type: 'none' } };
}

function addTextObject(slide: Slide, object: TextObject): Slide {
    return { ...slide, 
        elements: [...(slide.elements || []), object] };
}

function addImageObject(slide: Slide, object: ImageObject): Slide {
    if (!isValidImageUrl(object.url)) return slide;
    return { ...slide, elements: [...slide.elements, object] };
}

function removeObject(slide: Slide, objectId: string): Slide {
    return {
        ...slide,
        elements: slide.elements.filter(object => object.id !== objectId)
    };
}

function resizeObject(slide: Slide, objectId: string, size: Size): Slide {
    return modifyObject(slide, objectId, { size });
}

function moveObject(slide: Slide, objectId: string, newX: number, newY: number): Slide {
    return modifyObject(slide, objectId, { position: { x: newX, y: newY } });
}

function updateTextObjectStyle(slide: Slide, objectId: string, fontFamily: string, fontSize: number, fontColor: string): Slide {
    return modifyObject(slide, objectId, {
        style: { fontFamily, fontColor, fontSize }
    } as Partial<TextObject>); 
}

export {
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground,
    addTextObject,
    addImageObject,
    removeObject,
    resizeObject,
    moveObject,
    updateTextObjectStyle,
};
