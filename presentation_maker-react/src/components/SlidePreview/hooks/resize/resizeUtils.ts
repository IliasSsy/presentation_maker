import type { Point, Size, SlideObject } from "../../../../../../types/objects";

const MIN_SIZE = 10;

type ResizeDirection =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "left"
    | "right"
    | "top"
    | "bottom";

const cursorMap: Record<ResizeDirection, string> = {
    "top": "ns-resize",
    "bottom": "ns-resize",
    "left": "ew-resize",
    "right": "ew-resize",
    "top-left": "nwse-resize",
    "bottom-right": "nwse-resize",
    "top-right": "nesw-resize",
    "bottom-left": "nesw-resize",
};

type SelectionBox = {
    point: Point;
    size: Size;
};

function calculateResizedBox(startBox: SelectionBox, direction: ResizeDirection, deltaX: number, deltaY: number): SelectionBox {
    const newBox = structuredClone(startBox);
    if (direction.includes("right")) {
        newBox.size.width = Math.max(MIN_SIZE, startBox.size.width + deltaX);
    }
    if (direction.includes("left")) {
        const width = startBox.size.width - deltaX;
        if (width > MIN_SIZE) {
            newBox.point.x = startBox.point.x + deltaX;
            newBox.size.width = width;
        }
    }
    if (direction.includes("bottom")) {
        newBox.size.height = Math.max(MIN_SIZE, startBox.size.height + deltaY);
    }
    if (direction.includes("top")) {
        const height = startBox.size.height - deltaY;
        if (height > MIN_SIZE) {
            newBox.point.y = startBox.point.y + deltaY;
            newBox.size.height = height;
        }
    }
    return newBox;
}

function resizeObject(item: SlideObject, startBox: SelectionBox, finalBox: SelectionBox): SlideObject {
    const scaleX = finalBox.size.width / startBox.size.width;
    const scaleY = finalBox.size.height / startBox.size.height;
    const newPosition = {
        x: finalBox.point.x + (item.position.x - startBox.point.x) * scaleX,
        y: finalBox.point.y + (item.position.y - startBox.point.y) * scaleY
    };
    if (item.type === "text") {
        return {
            ...item,
            position: newPosition,
            size: {
                width: item.size.width * scaleX,
                height: item.size.height * scaleY
            },
            style: {
                ...item.style,
            },
            content: item.content.map(chunk => ({
                ...chunk,
                style: {
                    ...chunk.style,
                    fontSize: Math.max(MIN_SIZE, Math.round(chunk.style.fontSize * scaleY))
                }
            }))
        };
    }
    if ("size" in item) {
        return {
            ...item,
            position: newPosition,
            size: {
                width: item.size.width * scaleX,
                height: item.size.height * scaleY
            }
        };
    }
    if (item.typeFigure === "circle") {
        const scale = Math.min(Math.abs(scaleX), Math.abs(scaleY));
        return {
            ...item,
            position: newPosition,
            radius: item.radius * scale
        };
    }
    return {
        ...item as SlideObject,
        position: newPosition
    };
}

function resizeObjects(objects: SlideObject[], startBox: SelectionBox, finalBox: SelectionBox): SlideObject[] {
    if (
        startBox.size.width <= 0 ||
        startBox.size.height <= 0
    ) {
        return objects;
    }
    return objects.map(item =>
        resizeObject(item, startBox, finalBox)
    );
}

export {
    calculateResizedBox,
    resizeObjects,
    cursorMap,
    type SelectionBox,
    type ResizeDirection
}