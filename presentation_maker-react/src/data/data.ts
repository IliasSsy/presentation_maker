import type { Presentation } from "../../../types/presentation.js"
import { createPresentation } from "../../../functions/presentation.js"
import { addSlide } from "../../../functions/slide.js"
import { generateId } from "../../../functions/utils.js"
import { addTextObject, setSlideBackgroundColor } from "../../../functions/objects.js"
import type { TextObject, TextStyle } from "../../../types/objects.js"
import type { Slide } from "../../../types/slide.js"

function createDefaultTextObject(
    content: string, 
    x: number, 
    y: number, 
    width: number, 
    height: number,
    fontFamily: string = "Arial", 
    fontSize: number = 14, 
    fontColor: string = "#333333",
    bold: boolean = false, 
    italic: boolean = false, 
    underline: boolean = false,
    fillColor: string = "none", 
    textAlign: TextStyle['textAlign'] = "left"
): TextObject {
    return {
        id: generateId(),
        position: { x, y },
        type: 'text',
        layer: 1,
        size: { width, height },
        content,
        style: {
            fontFamily,
            fontSize,
            fontColor,
            bold,
            italic,
            underline,
            fillColor,
            textAlign
        }
    };
}

function createTestPresentation(): Presentation {
    const presId = generateId()
    let presentation:Presentation = createPresentation('Тестовая презентация', presId, new Date());

    let slide1 = presentation.slides[0];
    slide1 = setSlideBackgroundColor(slide1, '#f0f0f0');
    const firstTextObject:TextObject = createDefaultTextObject('Доброе пожаловать', 50, 50, 400, 60, 'Arial', 32, '#333333')
    slide1 = addTextObject(slide1, firstTextObject);
    const secondTextObject = createDefaultTextObject('Лабораторная работа #2', 50, 120, 400, 40, 'Arial', 20, '#666666')
    slide1 = addTextObject(slide1, secondTextObject);

    let newSlideId = generateId()
    presentation = addSlide(presentation, newSlideId)
    let slide2:Slide = presentation.slides[1]
    slide2 = setSlideBackgroundColor(slide2, '#ffffff');
    slide2 = addTextObject(slide2, createDefaultTextObject('Список задач:', 50, 50, 300, 40, 'Arial', 24, '#000000'));
    slide2 = addTextObject(slide2, createDefaultTextObject('1. Разработать интерфейс', 50, 100, 300, 30, 'Arial', 18, '#333333'));
    slide2 = addTextObject(slide2, createDefaultTextObject('2. Добавить интерактивность', 50, 140, 300, 30, 'Arial', 18, '#333333'));
    slide2 = addTextObject(slide2, createDefaultTextObject('3. Выделить общие компоненты', 50, 180, 300, 30, 'Arial', 18, '#333333'));

    newSlideId = generateId()
    presentation = addSlide(presentation, newSlideId)
    let slide3 = presentation.slides[2]
    slide3 = setSlideBackgroundColor(slide3, '#e8f5e9');
    slide3 = addTextObject(slide3, createDefaultTextObject('Итоги работы:', 50, 50, 300, 40, 'Arial', 24, '#2e7d32'));
    slide3 = addTextObject(slide3, createDefaultTextObject('Готово!', 50, 120, 200, 60, 'Arial', 36, '#4caf50'));


    return presentation;
}


export {
  createTestPresentation,
};
