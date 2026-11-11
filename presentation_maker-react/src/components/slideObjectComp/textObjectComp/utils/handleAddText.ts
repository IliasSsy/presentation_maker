import { generateId } from '../../../../../../functions/utils';
import { updateTextModifier } from '../../../../modules/modifiers';
import { dispatch } from '../../../../modules/editor';
import type { TextObject, Point } from '../../../../../../types/objects';

function handleAddText(position: Point = { x: 50, y: 50 }) {
    const newTextObject: TextObject = {
        id: generateId(),
        type: 'text',
        position: { ...position },
        size: { width: 200, height: 40 },
        layer: 1, 
        style: {
            fillColor: 'transparent',
            textAlign: 'left'
        },
        content: [
            {
                text: 'Введите текст',
                style: {
                    fontFamily: 'Arial',
                    fontSize: 24,
                    fontColor: '#000000',
                    bold: false,
                    italic: false,
                    underline: false,
                }
            }
        ]
    };
    dispatch(updateTextModifier, newTextObject);
}

export {handleAddText}