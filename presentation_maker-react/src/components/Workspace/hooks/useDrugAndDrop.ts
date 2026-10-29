import { useState, useRef, useEffect } from "react";
import type { Point } from "../../../../../types/objects";

function useDragAndDrop(onDrop: (delta: Point) => void) {
    const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [draggedObjectIds, setDraggedObjectIds] = useState<string[]>([]);
    const startMousePosition = useRef<Point>({ x: 0, y: 0 });
    const handleMouseDown = (event: React.MouseEvent, objectIds: string[]) => {
        event.stopPropagation();
        setIsDragging(true);
        setDraggedObjectIds(objectIds);
        startMousePosition.current = { x: event.clientX, y: event.clientY };
        setDragOffset({ x: 0, y: 0 }); 
    };

    useEffect(() => {
        if (!isDragging) return;
        const getDelta = (clientX: number, clientY: number) => ({
            x: clientX - startMousePosition.current.x,
            y: clientY - startMousePosition.current.y
        });
        const onMouseMove = (event: MouseEvent) => {
            setDragOffset(getDelta(event.clientX, event.clientY));
        };
        const onMouseUp = (event: MouseEvent) => {
            setIsDragging(false);
            const finalDelta = getDelta(event.clientX, event.clientY);
            setDragOffset({ x: 0, y: 0 }); 
            setDraggedObjectIds([]); 
            if (finalDelta.x !== 0 || finalDelta.y !== 0) {
                onDrop(finalDelta); 
            }
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, [isDragging, onDrop]);        

    return { 
        dragOffset, 
        isDragging, 
        draggedObjectIds, 
        handleMouseDown 
    };
}

export { useDragAndDrop };