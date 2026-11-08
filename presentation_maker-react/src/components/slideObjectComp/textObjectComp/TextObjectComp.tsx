import { useState, useRef, useEffect } from "react";
import type { TextObject } from "../../../../../types/objects";
import { dispatch, getState } from "../../../modules/editor";
import { updateTextModifier } from "../../../modules/modifiers";
import { parseHtmlToChunks} from "../textObjectComp/utils/parseHtmlToChanks"


type TextObjectProps = {
    element: TextObject;
};

export function TextObjectComp({ element }: TextObjectProps) {
    const [isRedact, setIsRedact] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const presentation = getState();
    const activeSlideId = presentation?.activeSlideId;
    useEffect(() => {
        setIsRedact(false);
    }, [activeSlideId]);

    const baseStyle = element.content[0]?.style || {
        fontFamily: "Arial", fontSize: 16, fontColor: "#000000",
        bold: false, italic: false, underline: false,
    };
    useEffect(() => {
        if (isRedact && editorRef.current) {
            const editor = editorRef.current;
            const html = element.content.map(chunk => {
                let text = chunk.text
                if (chunk.style.bold) text = `<b>${text}</b>`;
                if (chunk.style.italic) text = `<i>${text}</i>`;
                if (chunk.style.underline) text = `<u>${text}</u>`;
                return text;
            }).join('');

            editor.innerHTML = html;
            editor.focus();

            const selection = window.getSelection();
            if (selection) {
                const range = document.createRange();
                range.selectNodeContents(editor);
                range.collapse(false); 
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }, [isRedact]);

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        const editor = e.currentTarget;
        const newWidth = editor.offsetWidth;
        const newHeight = editor.offsetHeight;
        const newContent = parseHtmlToChunks(editor, baseStyle);
        dispatch(updateTextModifier, {
            ...element,
            content: newContent,
            size: { width: newWidth, height: newHeight }
        });
        
        setIsRedact(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!(e.ctrlKey || e.metaKey)) return;
        const commands: Record<string, string> = { b: "bold", i: "italic", u: "underline" };
        const command = commands[e.key.toLowerCase()];
        if (!command) return;
        e.preventDefault();
        document.execCommand(command, false);
    };

    if (isRedact) {
        return (
            <div
                key={`editor-${element.id}`} 
                id={`text-editor-${element.id}`}
                ref={editorRef}
                contentEditable={true}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning={true}
                style={{
                    width: '100%', height: 'auto', minHeight: '100%',
                    textAlign: element.style.textAlign, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    userSelect: 'text',
                    fontFamily: baseStyle.fontFamily, fontSize: `${baseStyle.fontSize}px`,
                    color: baseStyle.fontColor,
                    fontWeight: baseStyle.bold ? 'bold' : 'normal',
                    fontStyle: baseStyle.italic ? 'italic' : 'normal',
                    textDecoration: baseStyle.underline ? 'underline' : 'none',
                }}
            />
        );
    }

    return (
        <div
            key={`view-${element.id}`} 
            id={`text-view-${element.id}`}
            onDoubleClick={() => setIsRedact(true)}
            style={{
                width: '100%', height: 'auto', minHeight: '100%',
                textAlign: element.style.textAlign, cursor: 'text', whiteSpace: 'pre-wrap',
            }}
        >
            {element.content.map((chunk, index) => (
                <span
                    key={index}
                    style={{
                        fontFamily: chunk.style.fontFamily, fontSize: `${chunk.style.fontSize}px`,
                        color: chunk.style.fontColor,
                        fontWeight: chunk.style.bold ? 'bold' : 'normal',
                        fontStyle: chunk.style.italic ? 'italic' : 'normal',
                        textDecoration: chunk.style.underline ? 'underline' : 'none',
                    }}
                >
                    {chunk.text}
                </span>
            ))}
        </div>
    );
}