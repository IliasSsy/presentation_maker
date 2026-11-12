import { useRef } from "react";
import type { TextObject, TextChunk } from "../../../../../types/objects";
import { dispatch, getState } from "../../../modules/editor";
import { updateTextModifier } from "../../../modules/modifiers";
import { TextPanel } from "../../TextPanel/TextPanel";
import { useRedactText } from "./hooks/useRedactText";

type TextObjectProps = {
    element: TextObject;
};

function TextObjectComp({ element }: TextObjectProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const presentation = getState();
    const activeSlideId = presentation?.activeSlideId;

    const handleSave = (newContent: TextChunk[], newSize: { width: number; height: number }) => {
        dispatch(updateTextModifier, {
            ...element,
            content: newContent,
            size: newSize,
        });
    };

    const {
        isRedact,
        editorRef,
        handleDoubleClick,
        handleInput,
        handleContainerBlur,
        handleKeyDown,
    } = useRedactText(element, activeSlideId, handleSave);

    const baseStyle = element.content[0]?.style || {
        fontFamily: "Arial",
        fontSize: 16,
        fontColor: "#000000",
        bold: false,
        italic: false,
        underline: false,
    };

    if (isRedact) {
        const isNearBottom = element.position.y + element.size.height > 450;
        return (
            <div
                ref={containerRef}
                onBlur={handleContainerBlur}
                style={{ position: "relative", width: "100%", height: "100%" }}
            >
                <div
                    key={`editor-${element.id}`}
                    id={`text-editor-${element.id}`}
                    ref={editorRef}
                    contentEditable={true}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    suppressContentEditableWarning={true}
                    style={{
                        width: "100%",
                        height: "auto",
                        minHeight: "100%",
                        outline: "none",
                        textAlign: element.style.textAlign,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                        userSelect: "text",
                        fontFamily: baseStyle.fontFamily,
                        fontSize: `${baseStyle.fontSize}px`,
                        color: baseStyle.fontColor,
                        zIndex: 3,
                    }}
                />
                <TextPanel
                    selectedTextObject={element}
                    placement={isNearBottom ? "top" : "bottom"}
                />
            </div>
        );
    }

    return (
        <div
            key={`view-${element.id}`}
            id={`text-view-${element.id}`}
            onDoubleClick={handleDoubleClick}
            style={{
                width: "100%",
                height: "auto",
                minHeight: "100%",
                textAlign: element.style.textAlign,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                overflowWrap: "break-word",
            }}
        >
            {element.content.map((chunk, index) => (
                <span
                    key={index}
                    style={{
                        fontFamily: chunk.style.fontFamily,
                        fontSize: `${chunk.style.fontSize}px`,
                        color: chunk.style.fontColor,
                        fontWeight: chunk.style.bold ? "bold" : "normal",
                        fontStyle: chunk.style.italic ? "italic" : "normal",
                        textDecoration: chunk.style.underline ? "underline" : "none",
                    }}
                >
                    {chunk.text}
                </span>
            ))}
        </div>
    );
}

export { TextObjectComp };