import type { Slide } from "../types/slide.js";
import { generateId } from "./utils.js"
import type { SlideObject } from "../types/objects.js";

const DefaultVal:number = 0;

function setSlideBackgroundColor(slide: Slide, color: string): Slide {
    if (!color) {
        return slide
    }
    return {
        ...slide,
        background: {type: 'color', color}
    }
}

function setSlideBackgroundImage(slide: Slide, url: string): Slide {
    const dot = url.lastIndexOf('.')
    if (dot === -1) {
        return slide
    }
    const format = url.slice(dot)
    if (
        format !== '.png' &&
        format !== '.img' &&
        format !== '.jpg' &&
        format !== '.jpeg' &&
        format !== '.webp' &&
        format !== '.gif'
    ) {
        return slide
    }
    return {
        ...slide,
        background: {type: 'image', url}
    }
}

function setSlideBackgroundGradient(slide: Slide, colors: string[], angle?: number): Slide {
    angle = angle ?? DefaultVal;
    return {
        ...slide,
        background: {type: 'gradient', colors, angle}
    }
}

function clearSlideBackground(slide: Slide): Slide {
    return {
        ...slide,
        background: {type: 'none'}
    }
}

function addTextObject(slide: Slide, content: string, x: number, y: number, width: number, height: number,
                        fontFamily: string, fontSize: number, fontColor: string, objectId: string): Slide {
        const textObject:SlideObject = {
            id: objectId,
            position: {x, y},
            type: 'text',
            layer: slide.elements.length,
            content,
            width,
            height,
            style: {
                fontFamily,
                fontSize,
                fontColor,
                bold: false,
                italic: false,
                underline: false,
                fillColor: 'transparent',
                textAlign: 'left'
            }
        }
        return {
            ...slide,
            elements: [...slide.elements, textObject]
    }
}

function addImageObject(slide: Slide, url: string, x: number, y: number, width: number, height: number, objectId: string): Slide {
    const dot = url.lastIndexOf('.')
    if (dot === -1) {
        return slide
    }
    const format = url.slice(dot)
    if (
        format !== '.png' &&
        format !== '.img' &&
        format !== '.jpg' &&
        format !== '.jpeg' &&
        format !== '.webp' &&
        format !== '.gif'
    ) {
        return slide
    }
    const imageObject:SlideObject = {
        id: objectId,
        position: {x, y},
        type: 'image',
        layer: slide.elements.length,
        width,
        height,
        url,
    }
    return {
        ...slide,
        elements: [...slide.elements, imageObject]
    }
}

function removeObject(slide: Slide, objectId: string): Slide {
    const index:number = slide.elements.findIndex(object => object.id === objectId)
    if (index === -1) {
        return slide;
    }
    return {
        ...slide,
        elements: [...slide.elements.slice(0, index), ...slide.elements.slice(index + 1)]
    }
}

function resizeObject(slide: Slide, objectId: string, newWidth: number, newHeight: number) {
    const index:number = slide.elements.findIndex(object => object.id === objectId)
    if (index === -1) {
        return slide
    }
    const element:SlideObject = slide.elements[index];
    let newElement: SlideObject;
    if (element.type === 'figure' && element.typeFigure === 'circle') {
        newElement = {
            ...element,
            radius: newWidth / 2,
        }
    } else {
        newElement = {
            ...element,
            width: newWidth,
            height: newHeight,
        }
    }
    return {
        ...slide,
        elements: [...slide.elements.slice(0, index), newElement, ...slide.elements.slice(index + 1)]
    }
}

function moveObject(slide: Slide, objectId: string, newX: number, newY: number): Slide {
    const index:number = slide.elements.findIndex(object => object.id === objectId);
    if (index === -1) {
        return slide
    }
    const element:SlideObject = slide.elements[index];
    const newElement:SlideObject = {
        ...element,
        position: { x: newX, y: newY}
    }
    return {
        ...slide,
        elements: [...slide.elements.slice(0, index), newElement, ...slide.elements.slice(index + 1)]
    }
}

function updateTextObjectStyle(slide: Slide, objectId: string, fontFamily: string, fontSize: number, fontColor: string): Slide {
    const index:number = slide.elements.findIndex(object => object.id === objectId);
    if (index === -1) {
        return slide;
    }
    const element:SlideObject = slide.elements[index];
    if (element.type !== 'text') {
        return slide;
    }
    const newElement:SlideObject = {
        ...element,
        style: {
            ...element.style,
            fontFamily,
            fontColor,
            fontSize,
        }
    }
    return {
        ...slide,
        elements: [...slide.elements.slice(0, index), newElement, ...slide.elements.slice(index + 1)]
    }
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
    updateTextObjectStyle
}