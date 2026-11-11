import { useState, useRef, useEffect } from "react";
import { chunksToHtml, placeCaretAtEnd } from "./redactTextUtils";
import type { TextObject, TextChunk } from "../../../../../../types/objects";
import { parseHtmlToChunks } from "../utils/parseHtmlToChanks";

function useRedactText(
    element: TextObject,
    activeSlideId?: string,
    onSave?: (newContent: TextChunk[], newSize: { width: number; height: number }) => void
) {
    const [isRedact, setIsRedact] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);
    const isInternalChange = useRef(false);
    const onSaveRef = useRef(onSave);
    const elementRef = useRef(element);
    onSaveRef.current = onSave;
    elementRef.current = element;

    useEffect(() => {
        setIsRedact(false);
        isInitialized.current = false;
    }, [activeSlideId]);

    const saveCurrentDom = () => {
        if (editorRef.current && onSaveRef.current) {
            const editor = editorRef.current;
            const newWidth = editor.offsetWidth;
            const newHeight = editor.offsetHeight;
            const baseStyle = elementRef.current.content[0]?.style || {
                fontFamily: "Arial",
                fontSize: 16,
                fontColor: "#000000",
                bold: false,
                italic: false,
                underline: false,
            };
            isInternalChange.current = true;
            const newContent: TextChunk[] = parseHtmlToChunks(editor, baseStyle);
            onSaveRef.current(newContent, { width: newWidth, height: newHeight });
        }
    };

    const handleContainerBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        const nextTarget = event.relatedTarget as Node | null;
        if (nextTarget && event.currentTarget.contains(nextTarget)) {
            return;
        }
        saveCurrentDom();
        setIsRedact(false);
        isInitialized.current = false;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!(event.ctrlKey || event.metaKey)) return;
        const commands: Record<string, string> = { b: "bold", i: "italic", u: "underline" };
        const command = commands[event.key.toLowerCase()];
        if (!command) return;
        event.preventDefault();
        document.execCommand(command, false);
        saveCurrentDom();
    };

    useEffect(() => {
        if (!isRedact || !editorRef.current) return;
        if (!isInitialized.current) {
            const editor = editorRef.current;
            editor.innerHTML = chunksToHtml(element.content);
            isInitialized.current = true;
            isInternalChange.current = false;
            placeCaretAtEnd(editor);
            return;
        }
        if (isInternalChange.current) {
            isInternalChange.current = false;
            return;
        }
        const editor = editorRef.current;
        editor.innerHTML = chunksToHtml(element.content);
        placeCaretAtEnd(editor);
    }, [isRedact, element.content]);

    return {
        isRedact,
        editorRef,
        handleDoubleClick: () => setIsRedact(true),
        handleInput: saveCurrentDom,
        handleContainerBlur,
        handleKeyDown,
    };
}

export {useRedactText};