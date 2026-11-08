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
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Delete' || event.key === 'Backspace') {
                if (activeObjectIds.length > 0) {
                    dispatch(removeSelectedObjectsModifier, activeObjectIds);    
                    setActiveObjectIds([]);
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
            setActiveObjectIds((oldIds) => {
                if (oldIds.includes(objectId)) {
                    return oldIds.filter((id) => id !== objectId);
                } else {
                    return [...oldIds, objectId];
                }
            });
        } else {
            setActiveObjectIds([objectId]);
        }
    }

    function handleBackgroundClick() {
        setActiveObjectIds([]); 
    }

    return {
        activeObjectIds,
        handleObjectClick,
        handleBackgroundClick 
    };
}

export { useSelection };