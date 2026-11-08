import { useRef } from "react";
import type { Slide } from "../../../../types/slide";
import { SlideObjectComp } from "../slideObject/SlideObject"; 
import { useDragAndDrop } from "./hooks/useDrugAndDrop"; 
import { useResize } from "./hooks/resize/useResize"; 
import { dispatch } from "../../modules/editor";
import { moveSelectedObjectsModifier, resizeSelectedObjectsModifier } from "../../modules/modifiers";
import styles from "./SlidePreview.module.css";
import type { ResizeDirection } from "./hooks/resize/resizeUtils";

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

type SlidePreviewProps = {
    slide: Slide;
    selectedIds: string[];
    onObjectClick: (e: React.MouseEvent, id: string) => void; 
    onBackgroundClick: (e: React.MouseEvent) => void;
}

function SlidePreview({ slide, selectedIds = [], onObjectClick, onBackgroundClick }: SlidePreviewProps) {
    const { dragOffset, isDragging, draggedObjectIds, handleMouseDown } = useDragAndDrop((delta) => {
        if (draggedObjectIds.length > 0) {
            dispatch(moveSelectedObjectsModifier, slide.id, draggedObjectIds, delta);
        }
    });
    const selectedElements = (slide.elements || []).filter(element => selectedIds.includes(element.id));
    const { isResizing, handleResizeStart, previewBox } = useResize(
        selectedElements, 
        (newObjects) => {
            if (newObjects.length > 0) {
                dispatch(resizeSelectedObjectsModifier, slide.id, newObjects);
            }
        }
    );
    const clickStartPos = useRef({ x: 0, y: 0, wasSelected: false });
    let selectionBox = null;
    if (selectedIds.length > 0) {
        const isGroupDragging = isDragging && draggedObjectIds.some(id => selectedIds.includes(id));
        const minX = Math.min(...selectedElements.map(element => element.position.x));
        const minY = Math.min(...selectedElements.map(element => element.position.y));
        const maxX = Math.max(...selectedElements.map(element => {
            const width = 'size' in element ? element.size.width : element.radius * 2;
            return element.position.x + width;
        }));
        const maxY = Math.max(...selectedElements.map(element => {
            const height = 'size' in element ? element.size.height : element.radius * 2;
            return element.position.y + height;
        }));
        selectionBox = {
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
    const activeBox = (isResizing && previewBox) ? previewBox : selectionBox;
    return (
        <div 
            id="slide-background" 
            className={styles.slidePreview} 
            onMouseDown={(event) => {
                if (event.button !== 0) {
                    return
                }
                const target = event.target as HTMLElement;
                if (target.id === 'slide-background') {
                    onBackgroundClick(event);
                }
            }}
        >
            {(slide.elements || []).map(element => {
                const isSelected = (selectedIds || []).includes(element.id);
                const isMoving = isDragging && draggedObjectIds.includes(element.id);
                const currentPosition = {
                    x: element.position.x + (isMoving ? dragOffset.x : 0),
                    y: element.position.y + (isMoving ? dragOffset.y : 0)
                };
                
                return (
                   <SlideObjectComp 
                        key={element.id}    
                        object={element}
                        position={currentPosition} 
                        onClick={(event) => {
                            const dx = Math.abs(event.clientX - clickStartPos.current.x);
                            const dy = Math.abs(event.clientY - clickStartPos.current.y);
                            if (dx > 3 || dy > 3) return; 
                            if (clickStartPos.current.wasSelected) {
                                onObjectClick(event, element.id);
                            }
                        }}
                        onMouseDown={(event) => {
                            clickStartPos.current = { 
                                x: event.clientX, 
                                y: event.clientY, 
                                wasSelected: isSelected 
                            };
                            if (!isSelected) {
                                onObjectClick(event, element.id);
                            }
                            const idsToDrag = isSelected ? selectedIds : [element.id];
                            handleMouseDown(event, idsToDrag);
                        }}
                    />
                );
            })}
            
            {activeBox && (
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
                        if (event.button !== 0) return
                        const target = event.target as HTMLElement;
                        const resizeDirection = target.dataset.resize as ResizeDirection;
                        if (resizeDirection && selectionBox) {
                            handleResizeStart(event, resizeDirection, activeBox);
                            return; 
                        }
                        clickStartPos.current = { x: event.clientX, y: event.clientY, wasSelected: true };
                        handleMouseDown(event, selectedIds);
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
            )}
        </div>
    );
}

export { SlidePreview };