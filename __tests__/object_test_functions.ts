import { SlideObject } from "../types/objects"
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
}