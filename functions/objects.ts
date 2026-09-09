import type { Slide } from "../types/slide.js";
import { generateId } from "./utils.js"
import type { SlideObject, Size } from "../types/objects.js";

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
    const possibleArray = ['.png', '.img', '.jpg', '.jpeg', '.webp', '.gif']
    if (!possibleArray.includes(format)) {
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
    const possibleArray = ['.png', '.img', '.jpg', '.jpeg', '.webp', '.gif']
    if (!possibleArray.includes(format)) {
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
    return {
        ...slide,
        elements: slide.elements.filter(object => object.id !== objectId)
    };
}

function resizeObject(slide: Slide, objectId: string, size: Size ): Slide {
    return {
        ...slide,
        elements: slide.elements.map(element => {
            if (element.id != objectId) {
                return element
            }
            if (element.type === 'figure' && element.typeFigure === 'circle') {
                return {...element, radius: size.width / 2}
            }
            return {...element, width: size.width, height: size.height}
        })
    }
}

function moveObject(slide: Slide, objectId: string, newX: number, newY: number): Slide {
    return {
        ...slide,
        elements: slide.elements.map(element => 
            element.id === objectId ? {...element, position: {x: newX, y: newY}} : element
        )
    }
}

function updateTextObjectStyle(slide: Slide, objectId: string, fontFamily: string, fontSize: number, fontColor: string): Slide {
    return {
        ...slide,
        elements: slide.elements.map(element => {
            if (element.id !== objectId || element.type !== 'text') {
                return element
            }
            return {
                ...element,
                style: {...element.style, fontFamily, fontColor, fontSize}
            }
        })
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