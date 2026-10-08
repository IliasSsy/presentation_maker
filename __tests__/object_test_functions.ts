import { SlideObject } from "../types/objects"
import { TextObject, ImageObject } from "../types/objects";
const createText = (id: string, content = 'Test'): TextObject => ({
    id, 
    type: 'text', 
    layer: 0, 
    content,
    position: { x: 10, y: 20 }, 
    size: { width: 100, height: 50 },
    style: { 
        fontFamily: 'Arial', 
        fontSize: 14, 
        fontColor: 'black', 
        bold: false, 
        italic: false, 
        underline: false, 
        fillColor: 'transparent', 
        textAlign: 'left' 
    }
})

const img = (id: string, url = 'image.jpg'): ImageObject => ({
    id, 
    type: 'image', 
    layer: 0, 
    position: { x: 10, y: 20 }, 
    size: { width: 100, height: 50 }, 
    url
})   

function createBaseFigure(id: string, typeFigure: 'circle' | 'rectangle' | 'triangle'): any {
    return {
        id,
        position: { x: 10, y: 20 },
        type: 'figure',
        layer: 0,
        typeFigure,
        borderColor: 'black',
        fillColor: 'red'
    };
}

function createTestTriangle(): SlideObject {
    return {
        ...createBaseFigure('triangle1', 'triangle'),
        points: [{ x: 10, y: 10 }, { x: 15, y: 15 }, { x: 18, y: 0 }],
        width: 30,
        height: 40
    };
}

function createTestCircle(): SlideObject {
    return {
        ...createBaseFigure('circle1', 'circle'),
        radius: 50
    };
}

function createTestRectangle(): SlideObject {
    return {
        ...createBaseFigure('rectangle1', 'rectangle'),
        width: 30,
        height: 40
    };
}

export {
    createTestCircle,
    createTestRectangle,
    createTestTriangle,
    createText,
    img
}