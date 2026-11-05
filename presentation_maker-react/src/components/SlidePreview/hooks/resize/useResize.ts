import { useState, useEffect, useRef } from "react";
import type { Point, SlideObject } from "../../../../../../types/objects";
import {calculateResizedBox} from "./resizeUtils";
import type {ResizeDirection, SelectionBox} from "./resizeUtils";
import { resizeObjects } from "./resizeUtils";

type ResizeState = {
    direction: ResizeDirection;
    startMouse: Point;
    startBox: SelectionBox;
    startObjects: SlideObject[];
};

function useResize(selectedObjects: SlideObject[] = [], onResizeEnd: (newObjects: SlideObject[]) => void) {
    const [isResizing, setIsResizing] = useState(false);
    const [previewBox, setPreviewBox] = useState<SelectionBox | null>(null);
    const resizeStateRef = useRef<ResizeState>(null);
    const handleResizeStart = (event: React.MouseEvent, direction: ResizeDirection, currentBox: SelectionBox) => {
        event.preventDefault();
        resizeStateRef.current = {
            direction,
            startMouse: {
                x: event.clientX,
                y: event.clientY
            },
            startBox: {
                point: { ...currentBox.point },
                size: { ...currentBox.size }
            },
            startObjects: structuredClone(selectedObjects)
        };
        setPreviewBox(currentBox);
        setIsResizing(true);
    };
    const getCurrentBox = (event: MouseEvent, state: ResizeState): SelectionBox => {
        const deltaX = event.clientX - state.startMouse.x;
        const deltaY = event.clientY - state.startMouse.y;
        return calculateResizedBox(
            state.startBox,
            state.direction,
            deltaX,
            deltaY
        );
    };
    useEffect(() => {
        if (!isResizing) return;
        const handleMouseMove = (event: MouseEvent) => {
            const state = resizeStateRef.current;
            if (!state) return;
            setPreviewBox(getCurrentBox(event, state));
        }; 
        const handleMouseUp = (event: MouseEvent) => {
            const state = resizeStateRef.current;
            if (!state) return;
            const finalBox = getCurrentBox(event, state);
            const updatedObjects = resizeObjects(state.startObjects, state.startBox, finalBox);
            onResizeEnd(updatedObjects);
            resizeStateRef.current = null;
            setIsResizing(false);
            setPreviewBox(null);
        };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing, onResizeEnd]);
    return {
        isResizing,
        handleResizeStart,
        previewBox
    };
}

export { useResize };
