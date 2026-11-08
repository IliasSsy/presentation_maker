import { useState, useRef, useEffect } from "react";
import type { TextObject } from "../../../../../../types/objects";

function useRedactText(element: TextObject) {
    const [isRedact, setIsRedact] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)

    const handleDoubleClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest(`#text-view-${element.id}`)) {
            setIsRedact(true)
        }
    }

    const handleBlur = () => {
        setIsRedact(false)
        if (editorRef.current) {
            const rawText = editorRef.current.innerText
            // В будущем здесь будет dispatch для сохранения
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'b': 
                e.preventDefault(); 
                document.execCommand('bold', false); 
                break;
            case 'i': 
                e.preventDefault();
                document.execCommand('italic', false);
                break;
            case 'u': 
                e.preventDefault();
                document.execCommand('underline', false);
                break;
        }
    }
};

    useEffect(() => {
        if (isRedact && editorRef.current) {
            editorRef.current.focus()
            const selection = window.getSelection()
            const range = document.createRange()
            range.selectNodeContents(editorRef.current)
            range.collapse(false)
            selection?.removeAllRanges()
            selection?.addRange(range)
        }
    }, [isRedact])

    return {
        isRedact,
        editorRef,
        handleDoubleClick,
        handleBlur,
        handleKeyDown
    };
}

export { useRedactText }