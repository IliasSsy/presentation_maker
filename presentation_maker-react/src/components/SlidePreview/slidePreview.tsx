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
                return (
                    <SlideObjectComp 
                        key={element.id}    
                        object={element}
                        position={currentPosition} 
                        isSelected={isSelected}
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
        </div>
    );
}

export { SlidePreview };