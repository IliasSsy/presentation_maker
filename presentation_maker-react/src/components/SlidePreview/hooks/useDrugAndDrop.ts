
import { useState, useRef, useEffect } from "react";
import type { Point } from "../../../../../types/objects";

function useDragAndDrop(onDrop: (delta: Point) => void) {
    const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [draggedObjectIds, setDraggedObjectIds] = useState<string[]>([]);

    const startMousePosition = useRef<Point>({ x: 0, y: 0 });
    const pendingDrag = useRef(false);
    const draggedIdsRef = useRef<string[]>([]);

    const handleMouseDown = (event: React.MouseEvent, objectIds: string[]) => {
        if (event.button !== 0) return;

        startMousePosition.current = {
            x: event.clientX,
            y: event.clientY
        };

        draggedIdsRef.current = objectIds;
        pendingDrag.current = true;

        setDragOffset({ x: 0, y: 0 });
    };

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            if (!pendingDrag.current) return;

            const dx = event.clientX - startMousePosition.current.x;
            const dy = event.clientY - startMousePosition.current.y;
            if (!isDragging && Math.hypot(dx, dy) > 3) {
                setIsDragging(true);
                setDraggedObjectIds(draggedIdsRef.current);
            }

            if (Math.hypot(dx, dy) > 3) {
                setDragOffset({ x: dx, y: dy });
            }
        };

        const onMouseUp = (event: MouseEvent) => {
            if (!pendingDrag.current) return;

            pendingDrag.current = false;

            const dx = event.clientX - startMousePosition.current.x;
            const dy = event.clientY - startMousePosition.current.y;
            if (Math.hypot(dx, dy) > 3) {
                onDrop({ x: dx, y: dy });
            }

            setIsDragging(false);
            setDraggedObjectIds([]);
            setDragOffset({ x: 0, y: 0 });
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
