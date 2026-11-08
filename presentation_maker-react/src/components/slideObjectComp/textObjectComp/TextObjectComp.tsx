import type { TextObject } from '../../../../../types/objects';
import { useRedactText } from '../../common/textObjectComp/hooks/useRedactText';

type TextObjectProps = {
    element: TextObject;
};

export function TextObjectComp({ element }: TextObjectProps) {
    const { isRedact, editorRef, handleDoubleClick, handleBlur, handleKeyDown} = useRedactText(element);

    if (isRedact) {
        return (
            <div
                id={`text-editor-${element.id}`}
                ref={editorRef}
                contentEditable={true}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning={true}
                style={{
                    width: '100%',
                    height: '100%',
                    outline: '2px solid #0b57d0',
                    cursor: 'text',
                    textAlign: element.style.textAlign,
                    whiteSpace: 'pre-wrap',
                    userSelect: 'text'
                }}
            >
                {element.content.map(chunk => chunk.text).join('')}
            </div>
        );
    }

    return (
        <div 
            id={`text-view-${element.id}`}
            onDoubleClick={handleDoubleClick}
            style={{ 
                width: '100%', 
                height: '100%', 
                textAlign: element.style.textAlign,
                cursor: 'text',
                whiteSpace: 'pre-wrap',
            }}
        >
            {element.content.map((chunk, index) => (
                <span 
                    key={index} 
                    style={{
                        fontFamily: chunk.style.fontFamily,
                        fontSize: `${chunk.style.fontSize}px`,
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