import type { Presentation } from "../../../types/presentation.js"
import { createPresentation } from "../../../functions/presentation.js"
import { addSlide } from "../../../functions/slide.js"
import { generateId } from "../../../functions/utils.js"
import { addTextObject, setSlideBackgroundColor } from "../../../functions/objects.js"
import type { TextObject, BlockStyle, InlineStyle, Point, Size } from "../../../types/objects.js"
import type { Slide } from "../../../types/slide.js"

const defaultInlineStyle: InlineStyle = {
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#333333",
    bold: false,
    italic: false,
    underline: false,
};

const defaultBlockStyle: BlockStyle = {
    fillColor: "transparent",
    textAlign: "left"
};

function createDefaultTextObject(
    content: string, 
    position: Point, 
    size: Size,
    customStyle?: Partial<InlineStyle & BlockStyle>
): TextObject {
    return {
        id: generateId(),
        position,
        type: 'text',
        layer: 1,
        size,
        style: {
            fillColor: customStyle?.fillColor || defaultBlockStyle.fillColor,
            textAlign: customStyle?.textAlign || defaultBlockStyle.textAlign,
        },
        content: [
            {
                text: content,
                style: {
                    fontFamily: customStyle?.fontFamily || defaultInlineStyle.fontFamily,
                    fontSize: customStyle?.fontSize || defaultInlineStyle.fontSize,
                    fontColor: customStyle?.fontColor || defaultInlineStyle.fontColor,
                    bold: customStyle?.bold || defaultInlineStyle.bold,
                    italic: customStyle?.italic || defaultInlineStyle.italic,
                    underline: customStyle?.underline || defaultInlineStyle.underline,
                }
            }
        ]
    };
}

function createTestPresentation(): Presentation {
const presId = generateId();
    let presentation: Presentation = createPresentation('Тестовая презентация', presId, new Date());
    const firstSlideId = generateId();
    presentation = addSlide(presentation, firstSlideId);
    let slide1 = presentation.slides[0];
    slide1 = setSlideBackgroundColor(slide1, '#f0f0f0');
    slide1 = addTextObject(slide1, createDefaultTextObject('Добро пожаловать', { x: 50, y: 50 }, { width: 400, height: 60 }, { fontSize: 32 }));
    slide1 = addTextObject(slide1, createDefaultTextObject('Лабораторная работа #2', { x: 50, y: 120 }, { width: 400, height: 40 }, { fontSize: 20, fontColor: '#666666' }));
    
    presentation = {
        ...presentation,
        slides: [slide1]
    };

    let newSlideId = generateId();
    presentation = addSlide(presentation, newSlideId);
    let slide2: Slide = presentation.slides[1];
    slide2 = setSlideBackgroundColor(slide2, '#e903fe');
    slide2 = addTextObject(slide2, createDefaultTextObject('Список задач:', { x: 50, y: 50 }, { width: 300, height: 40 }, { fontSize: 24, fontColor: '#000000' }));
    slide2 = addTextObject(slide2, createDefaultTextObject('1. Разработать интерфейс', { x: 50, y: 100 }, { width: 300, height: 30 }, { fontSize: 18 }));
    slide2 = addTextObject(slide2, createDefaultTextObject('2. Добавить интерактивность', { x: 50, y: 140 }, { width: 300, height: 30 }, { fontSize: 18 }));
    slide2 = addTextObject(slide2, createDefaultTextObject('3. Выделить общие компоненты', { x: 50, y: 180 }, { width: 300, height: 30 }, { fontSize: 18 }));

    presentation = {
        ...presentation,
        slides: [presentation.slides[0], slide2]
    };

    newSlideId = generateId();
    presentation = addSlide(presentation, newSlideId);
    let slide3 = presentation.slides[2];
    slide3 = setSlideBackgroundColor(slide3, '#000000');
    slide3 = addTextObject(slide3, createDefaultTextObject('Итоги работы:', { x: 50, y: 50 }, { width: 300, height: 40 }, { fontSize: 24, fontColor: '#2e7d32' }));
    slide3 = addTextObject(slide3, createDefaultTextObject('Готово!', { x: 50, y: 120 }, { width: 200, height: 60 }, { fontSize: 36, fontColor: '#4caf50' }));

    presentation = {
        ...presentation,
        slides: [presentation.slides[0], presentation.slides[1], slide3]
    };

    return presentation;
}


export {
  createTestPresentation,
};