import { useRef, useState } from "react"; // 1. Импортируем useState
import type { Slide } from "../../../../types/slide";
import { SlideObjectComp } from "../SlideObjectComp/SlideObject"; 
import { useDragAndDrop } from "./hooks/useDrugAndDrop";
import { useResize } from "./hooks/resize/useResize";
import { SelectionBox } from "./components/SelectionBox/SelectionBox";
import { dispatch } from "../../modules/editor";
import { moveSelectedObjectsModifier, resizeSelectedObjectsModifier } from "../../modules/modifiers";
import { resizeObjects } from "./hooks/resize/resizeUtils";
import { calculateSelectionBox } from "./components/SelectionBox/CalculateSelectionBox";
import { getSlideBackground } from "./components/Background/GetBackgroundStyle";
import { SlideProperties } from "../SlideProperties/SlideProperties.tsx"; 
import styles from "./SlidePreview.module.css";

type SlidePreviewProps = {
    slide: Slide;
    selectedIds: string[];
    onObjectClick: (e: React.MouseEvent, id: string) => void; 
    onBackgroundClick: (e: React.MouseEvent) => void;
}

function SlidePreview({ slide, selectedIds = [], onObjectClick, onBackgroundClick }: SlidePreviewProps) {
    const [isBgModalOpen, setIsBgModalOpen] = useState(false);
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
    const selectionBox = calculateSelectionBox(selectedElements, isDragging, draggedObjectIds, selectedIds, dragOffset);
    const activeBox = (isResizing && previewBox) ? previewBox : selectionBox;
    let displayElements = slide.elements || [];
    if (isResizing && previewBox && selectionBox) {
        const temporaryResizedObjects = resizeObjects(selectedElements, selectionBox, previewBox);
        displayElements = displayElements.map(element => {
            const tempVersion = temporaryResizedObjects.find(resizer => resizer.id === element.id);
            return tempVersion ? tempVersion : element;
        });
    }
    const slideBackground = getSlideBackground(slide.background);
    return (
        <div 
            id="slide-background" 
            className={styles.slidePreview} 
            style={{ background: slideBackground, width: '100%', height: '100%', position: 'relative' }}
            onMouseDown={(event) => {
                if (event.button === 0 && (event.target as HTMLElement).id === 'slide-background') {
                    onBackgroundClick(event);
                
                    if (selectedIds.length === 0) {
                        setIsBgModalOpen(true);
                    }
                }
            }}
        >
            {displayElements.map(element => {
                const isSelected = selectedIds.includes(element.id);
                const isMoving = isDragging && draggedObjectIds.includes(element.id);
                const currentPosition = {
                    x: element.position.x + (isMoving ? dragOffset.x : 0),
                    y: element.position.y + (isMoving ? dragOffset.y : 0)
                };
                return (
                   <SlideObjectComp 
                        key={element.id}    
                        object={element}
                        isSelected={isSelected}
                        position={currentPosition} 
                        onClick={(event) => {
                            if ((event.target as HTMLElement).closest('[data-panel="text-panel"]')) {
                                return;
                            }
                            const dx = Math.abs(event.clientX - clickStartPos.current.x);
                            const dy = Math.abs(event.clientY - clickStartPos.current.y);
                            if (dx <= 3 && dy <= 3 && clickStartPos.current.wasSelected) {
                                onObjectClick(event, element.id);
                            }
                        }}
                        onMouseDown={(event) => {
                            if ((event.target as HTMLElement).closest('[data-panel="text-panel"]')) {
                                return;
                            }
                            setIsBgModalOpen(false);
                            clickStartPos.current = { x: event.clientX, y: event.clientY, wasSelected: isSelected };
                            if (!isSelected) onObjectClick(event, element.id);
                            handleMouseDown(event, isSelected ? selectedIds : [element.id]);
                        }}
                    />
                );
            })}  
            {activeBox && (
                <SelectionBox
                    activeBox={activeBox}
                    isDragging={isDragging}
                    selectionBox={selectionBox}
                    onResizeStart={handleResizeStart}
                    onMouseDown={(event) => {
                        clickStartPos.current = { x: event.clientX, y: event.clientY, wasSelected: true };
                        handleMouseDown(event, selectedIds);
                    }}
                />
            )}
            {isBgModalOpen && selectedIds.length === 0 && (
                <SlideProperties slide={slide} onClose={() => setIsBgModalOpen(false)} />
            )}
        </div>
    );
}

export { SlidePreview };