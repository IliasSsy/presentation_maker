import type { Slide } from "../types/slide.js";
import type { TextObject, ImageObject, Size } from "../types/objects.js";

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

function addTextObject(slide: Slide, object: TextObject): Slide {
    return {
        ...slide,
        elements: [...slide.elements, object]
    };
}

function addImageObject(slide: Slide, object: ImageObject): Slide {
    const dot = object.url.lastIndexOf('.')
    if (dot === -1) {
        return slide
    }
    const format = object.url.slice(dot)
    const possibleArray = ['.png', '.img', '.jpg', '.jpeg', '.webp', '.gif']
    if (!possibleArray.includes(format)) {
        return slide
    }
    return {
        ...slide,
        elements: [...slide.elements, object]
    }
}

function removeObject(slide: Slide, objectId: string): Slide {
    return {
        ...slide,
        elements: slide.elements.filter(object => object.id !== objectId)
    };
}

function resizeObject(slide: Slide, objectId: string, size: Size): Slide {
    return {
        ...slide,
        elements: slide.elements.map(object => 
            object.id === objectId ? { ...object, width: size.width, height: size.height } : object
        )
    };
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