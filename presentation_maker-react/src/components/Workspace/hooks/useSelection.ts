import { useState, useEffect } from "react";
import { getState, dispatch } from "../../../modules/editor";
import { removeSelectedObjectsModifier } from "../../../modules/modifiers";

function useSelection() {
    const state = getState();
    const activeSlideId = state?.activeSlideId;
    const [activeObjectIds, setActiveObjectIds] = useState<string[]>([]);
    useEffect(() => {
        setActiveObjectIds([]);
    }, [activeSlideId]);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (activeObjectIds.length > 0) {
                    dispatch(removeSelectedObjectsModifier, activeObjectIds)    
                    setActiveObjectIds([])
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeObjectIds]); 
    function handleObjectClick(event: React.MouseEvent, objectId: string) {
        event.preventDefault();
        if (event.shiftKey) {
            setActiveObjectIds((prev) => {
                if (prev.includes(objectId)) {
                    return prev.filter((id) => id !== objectId);
                } else {
                    return [...prev, objectId];
                }
            });
        } else {
            setActiveObjectIds([objectId]);
        }
    }
    function handleBackgroundClick(event: React.MouseEvent) {
        if (event.target === event.currentTarget) {
            setActiveObjectIds([]); 
        }
    }
    return {
        activeObjectIds,
        handleObjectClick,
        handleBackgroundClick 
    };
}

export { useSelection }