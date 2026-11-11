import { useRef, useCallback } from "react";
import { dispatch } from "../../../modules/editor";
import { addImageObjectModifier } from "../../../modules/modifiers";
import { generateId } from "../../../../../functions/utils";

function useImageUpload() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            dispatch(addImageObjectModifier, {
                id: generateId(),
                type: "image",
                position: { x: 200, y: 150 },
                size: { width: 300, height: 200 },
                url: event.target?.result,
            });
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);
    const triggerUpload = useCallback(() => {
        fileInputRef.current?.click();
    }, []);
    return { fileInputRef, handleFileChange, triggerUpload };
}

export {useImageUpload}