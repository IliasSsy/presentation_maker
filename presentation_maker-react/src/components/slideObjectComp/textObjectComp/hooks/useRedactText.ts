import { useState, useRef, useEffect } from "react";
import type { TextObject, TextChunk } from "../../../../../../types/objects";
// Проверь путь к парсеру!
import { parseHtmlToChunks } from "../utils/parseHtmlToChanks";

export function useRedactText(
    element: TextObject,
    activeSlideId?: string,
    onSave?: (newContent: TextChunk[], newSize: { width: number; height: number }) => void
) {
    const [isRedact, setIsRedact] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);

    // 🔥 ФИКС ПРОПАДАНИЯ ТЕКСТА:
    // Прячем стейт и коллбеки в рефы. Они никогда не устаревают!
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

    const handleDoubleClick = () => {
        setIsRedact(true);
    };

    const handleBlur = () => {
        // Берем актуальные данные из рефов, а не из старого замыкания
        if (editorRef.current && onSaveRef.current) {
            const editor = editorRef.current;
            const newWidth = editor.offsetWidth;
            const newHeight = editor.offsetHeight;
            const baseStyle = elementRef.current.content[0]?.style || {
                fontFamily: "Arial", fontSize: 16, fontColor: "#000000",
                bold: false, italic: false, underline: false,
            };

            const newContent: TextChunk[] = parseHtmlToChunks(editor, baseStyle);
            onSaveRef.current(newContent, { width: newWidth, height: newHeight });
        }
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
    };

    useEffect(() => {
        if (!isRedact || !editorRef.current || isInitialized.current) return;
        
        const editor = editorRef.current;
        
        // 🔥 ФИКС ДУБЛИРОВАНИЯ:
        // Собираем HTML и вставляем его руками ровно ОДИН РАЗ
        const html = elementRef.current.content.map(chunk => {
            let text = chunk.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            if (chunk.style.bold) text = `<b>${text}</b>`;
            if (chunk.style.italic) text = `<i>${text}</i>`;
            if (chunk.style.underline) text = `<u>${text}</u>`;
            return text;
        }).join('');
        
        editor.innerHTML = html;
        isInitialized.current = true;

        editor.focus();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
    }, [isRedact]);

    return { isRedact, editorRef, handleDoubleClick, handleBlur, handleKeyDown };
}