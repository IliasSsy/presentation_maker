import { useState, useEffect, useRef } from "react";
import type { Point } from "../../../../../types/objects";

function useResize(onDrop: (newPosition: Point) => void) {
    const resizeData = useRef({
        isResizing: false,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
    })
    const [isResizing, setIsResizing] = useState(false)
    const [objectSize, setObjectSize] = useState([])
    useEffect(() => {
        if (!isResizing) return;
        
    }, [onDrop])
}