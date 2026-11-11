import React from 'react';
import type { ResizeDirection } from '../../hooks/resize/resizeUtils';

const resizeHandleStyle: React.CSSProperties = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    backgroundColor: '#ffffff',
    border: '2px solid #0b99ff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 15,
    boxSizing: 'border-box',
};

type SelectionBoxProps = {
    activeBox: {
        point: { x: number; y: number };
        size: { width: number; height: number };
    };
    isDragging: boolean;
    selectionBox: {
        point: { x: number; y: number };
        size: { width: number; height: number };
    } | null;
    onResizeStart: (event: React.MouseEvent, direction: ResizeDirection, box: any) => void;
    onMouseDown: (event: React.MouseEvent) => void;
};

function SelectionBox({
    activeBox,
    isDragging,
    selectionBox,
    onResizeStart,
    onMouseDown,
}: SelectionBoxProps) {
    return (
        <div 
            style={{
                position: 'absolute',
                left: `${activeBox.point.x}px`,
                top: `${activeBox.point.y}px`,
                width: `${activeBox.size.width}px`,
                height: `${activeBox.size.height}px`,
                outline: '1px solid #0b99ff',
                cursor: isDragging ? 'grabbing' : 'grab', 
                zIndex: 5, 
                backgroundColor: 'transparent', 
            }}
            onMouseDown={(event) => {
                if (event.button !== 0) return;
                const target = event.target as HTMLElement;
                const resizeDirection = target.dataset.resize as ResizeDirection;
                
                if (resizeDirection && selectionBox) {
                    onResizeStart(event, resizeDirection, activeBox);
                    return; 
                }
                
                onMouseDown(event);
            }}
        >
            <div data-resize="top" style={{ position: 'absolute', top: '0%', left: 0, right: 0, height: '6px', transform: 'translateY(-50%)', cursor: 'ns-resize', zIndex: 10 }} />
            <div data-resize="bottom" style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '6px', transform: 'translateY(-50%)', cursor: 'ns-resize', zIndex: 10 }} />
            <div data-resize="left" style={{ position: 'absolute', top: 0, bottom: 0, left: '0%', width: '6px', transform: 'translateX(-50%)', cursor: 'ew-resize', zIndex: 10 }} />
            <div data-resize="right" style={{ position: 'absolute', top: 0, bottom: 0, left: '100%', width: '6px', transform: 'translateX(-50%)', cursor: 'ew-resize', zIndex: 10 }} />
            
            <div data-resize="top-left" style={{ ...resizeHandleStyle, top: '0%', left: '0%', cursor: 'nwse-resize' }} />
            <div data-resize="top-right" style={{ ...resizeHandleStyle, top: '0%', left: '100%', cursor: 'nesw-resize' }} />
            <div data-resize="bottom-left" style={{ ...resizeHandleStyle, top: '100%', left: '0%', cursor: 'nesw-resize' }} />
            <div data-resize="bottom-right" style={{ ...resizeHandleStyle, top: '100%', left: '100%', cursor: 'nwse-resize' }} />
        </div>
    );
}

export {SelectionBox}