import { useState, useRef, useEffect, useCallback } from "react";
import type { TextObject, TextChunk } from "../../../../../../types/objects";
import { parseHtmlToChunks } from "../utils/parseHtmlToChanks";

function chunksToHtml(content: TextChunk[]): string {
    return content
        .map((chunk) => {
            let text = chunk.text
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\n", "<br>");
            const styles: string[] = [];
            if (chunk.style.fontFamily) {
                const cleanFont = chunk.style.fontFamily.replace(/['"]/g, "");
                styles.push(`font-family: '${cleanFont}'`);
            }
            if (chunk.style.fontSize) {
                styles.push(`font-size: ${chunk.style.fontSize}px`);
            }
            if (chunk.style.fontColor) {
                styles.push(`color: ${chunk.style.fontColor}`);
            }
            if (chunk.style.bold) {
                styles.push(`font-weight: bold`);
            }
            if (chunk.style.italic) {
                styles.push(`font-style: italic`);
            }
            if (chunk.style.underline) {
                styles.push(`text-decoration: underline`);
            }

            return `<span style="${styles.join("; ")}">${text}</span>`;
        })
        .join("");
}

function placeCaretAtEnd(editor: HTMLElement) {
    editor.focus();
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false); 
    selection.removeAllRanges();
    selection.addRange(range);
}

export function useRedactText(
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

    useEffect(() => {
        onSaveRef.current = onSave;
        elementRef.current = element;
    }, [onSave, element]);

    useEffect(() => {
        setIsRedact(false);
        isInitialized.current = false;
    }, [activeSlideId]);

    const saveCurrentDom = useCallback(() => {
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
    }, []);

    const handleDoubleClick = () => {
        setIsRedact(true);
    };

    const handleInput = () => {
        saveCurrentDom();
    };

    const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        const nextTarget = e.relatedTarget as Node | null;
        if (nextTarget && e.currentTarget.contains(nextTarget)) {
            return;
        }
        saveCurrentDom();
        setIsRedact(false);
        isInitialized.current = false;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!(e.ctrlKey || e.metaKey)) return;
        const commands: Record<string, string> = { b: "bold", i: "italic", u: "underline" };
        const command = commands[e.key.toLowerCase()];
        if (!command) return;
        e.preventDefault();
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
        handleDoubleClick,
        handleInput,
        handleContainerBlur,
        handleKeyDown,
    };
}