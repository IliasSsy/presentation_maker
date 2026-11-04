import { useRef } from "react";
import type { Slide } from "../../../../types/slide";
import { SlideObjectComp } from "../slideObject/SlideObject"; 
import { useDragAndDrop } from "./hooks/useDrugAndDrop"; 
import { dispatch } from "../../modules/editor";
import { moveSelectedObjectsModifier } from "../../modules/modifiers";
import styles from "./SlidePreview.module.css";

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
    const clickStartPos = useRef({ x: 0, y: 0 });
    let groupBoundingBox = null;
    
    if (selectedIds.length > 1) {
        const selectedElements = (slide.elements || []).filter(element => selectedIds.includes(element.id));
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
        
        groupBoundingBox = {
            x: minX + (isGroupDragging ? dragOffset.x : 0),
            y: minY + (isGroupDragging ? dragOffset.y : 0),
            width: maxX - minX,
            height: maxY - minY,
        };
    }

    return (
        <div 
            id="slide-background" 
            className={styles.slidePreview} 
            onClick={(event) => {
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
                const showIndividualSelection = isSelected && selectedIds.length === 1;
                return (
                    <SlideObjectComp 
                        key={element.id}    
                        object={element}
                        position={currentPosition} 
                        isSelected={showIndividualSelection}
                        onClick={(event) => {
                            const dx = Math.abs(event.clientX - clickStartPos.current.x);
                            const dy = Math.abs(event.clientY - clickStartPos.current.y);
                            if (dx > 3 || dy > 3) {
                                return; 
                            }
                            onObjectClick(event, element.id);
                        }}
                        onMouseDown={(event) => {
                            clickStartPos.current = { x: event.clientX, y: event.clientY };
                            const idsToDrag = isSelected ? selectedIds : [element.id];
                            handleMouseDown(event, idsToDrag);
                        }}
                    />
                );
            })}
            {groupBoundingBox && (
                <div 
                    style={{
                        position: 'absolute',
                        left: `${groupBoundingBox.x}px`,
                        top: `${groupBoundingBox.y}px`,
                        width: `${groupBoundingBox.width}px`,
                        height: `${groupBoundingBox.height}px`,
                        outline: '1px solid #0b99ff',
                        cursor: isDragging ? 'grabbing' : 'grab', 
                        zIndex: 5, 
                        backgroundColor: 'transparent', 
                    }}
                    onMouseDown={(event) => {
                        handleMouseDown(event, selectedIds);
                    }}
                />
            )}
        </div>
    );
}

export { SlidePreview };