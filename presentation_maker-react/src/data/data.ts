import type { Presentation } from "../../../types/presentation.js"
import { createPresentation } from "../../../functions/presentation.js"
import { addSlide } from "../../../functions/slide.js"
import { generateId } from "../../../functions/utils.js"
import { addTextObject, setSlideBackgroundColor } from "../../../functions/objects.js"
import type { TextObject, TextStyle } from "../../../types/objects.js"
import type { Slide } from "../../../types/slide.js"
import type { Point, Size } from "../../../types/objects.js"

const defaultStyle: TextStyle = {
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#333333",
    bold: false,
    italic: false,
    underline: false,
    fillColor: "none",
    textAlign: "left"
};

function createDefaultTextObject(
    content: string, 
    position: Point, 
    size: Size,
    customStyle?: Partial<TextStyle>
): TextObject {
    return {
        id: generateId(),
        position,
        type: 'text',
        layer: 1,
        size,
        content,
        style: {
            ...defaultStyle,
            ...customStyle
        }
    };
}

function createTestPresentation(): Presentation {
    const presId = generateId();
    let presentation: Presentation = createPresentation('Тестовая презентация', presId, new Date());

    let slide1 = presentation.slides[0];
    slide1 = setSlideBackgroundColor(slide1, '#f0f0f0');
    slide1 = addTextObject(slide1, createDefaultTextObject('Доброе пожаловать', { x: 50, y: 50 }, { width: 400, height: 60 }, { fontSize: 32 }));
    slide1 = addTextObject(slide1, createDefaultTextObject('Лабораторная работа #2', { x: 50, y: 120 }, { width: 400, height: 40 }, { fontSize: 20, fontColor: '#666666' }));
    
    presentation = {
        ...presentation,
        slides: [slide1]
    };

    let newSlideId = generateId();
    presentation = addSlide(presentation, newSlideId);
    let slide2: Slide = presentation.slides[1];
    slide2 = setSlideBackgroundColor(slide2, '#ffffff');
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
    slide3 = setSlideBackgroundColor(slide3, '#e8f5e9');
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