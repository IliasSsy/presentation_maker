import type { SlideObject } from "../../../../../../types/objects";

export function calculateSelectionBox(
    selectedElements: SlideObject[],
    isDragging: boolean,
    draggedObjectIds: string[],
    selectedIds: string[],
    dragOffset: { x: number; y: number }
) {
    if (selectedIds.length === 0 || selectedElements.length === 0) return null;

    const isGroupDragging = isDragging && draggedObjectIds.some(id => selectedIds.includes(id));
    
    const minX = Math.min(...selectedElements.map(el => el.position.x));
    const minY = Math.min(...selectedElements.map(el => el.position.y));
    
    const maxX = Math.max(...selectedElements.map(el => {
        const width = 'size' in el ? el.size.width : el.radius * 2;
        return el.position.x + width;
    }));
    
    const maxY = Math.max(...selectedElements.map(el => {
        let height = 0;
        if (el.type === 'text') {
            height = el.size.height;
        } else if ('size' in el) {
            height = el.size.height;
        } else {
            height = el.radius * 2;
        }
        return el.position.y + height;
    }));

    return {
        point: {
            x: minX + (isGroupDragging ? dragOffset.x : 0),
            y: minY + (isGroupDragging ? dragOffset.y : 0),
        },
        size: {
            width: maxX - minX,
            height: maxY - minY,
        }
    };
}