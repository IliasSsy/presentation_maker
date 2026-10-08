// internationalization

const dictionary: Record<string, { ru: string; en: string }> = {
    selectLayout: {
        ru: "Выбрать макет нового слайда",
        en: "Select new slide layout",
    },
    addSlide: {
        ru: "Добавить слайд",
        en: "Add slide",
    },
    redoItem: {
        ru: "Повторить",
        en: "Redo"
    },
    undoItem: {
        ru: "Отменить",
        en: "Undo"
    },
    deleteItem: {
        ru: "Удалить",
        en: "Delete",
    },
    printItem: {
        ru: "Печать",
        en: "Printing"
    },
    scaleButton: {
        ru: "Увеличить",
        en: "Scale"
    },
    scaleField: {
        ru: "Масштаб",
        en: "Increase"
    },
    cursorButton: {
        ru: "Выбрать",
        en: "Choose"
    },
    textButton: {
        ru: "Текст",
        en: "Text"
    },
    Background: {
        ru: "Фон",
        en: "Background"
    },
    shapesButton: {
        ru: "Фигуры",
        en: "Shapes"
    },
    slideShow: {
        ru: "Режим Показа",
        en: "Slide Show"
    },
    presentationName: {
        ru: "Имя презентации",
        en: "Presentation Name"
    }
};

type Lang = 'ru' | 'en';

function getCurrentLang(): Lang {
    const saved = localStorage.getItem('app_lang');
    return (saved === 'en' || saved === 'ru') ? saved : 'en';
}

function setLang(lang: Lang) {
    localStorage.setItem('app_lang', lang);
    window.location.reload();
}

function translate(key: string): string {
    const currentLang = getCurrentLang();
    const item = dictionary[key];
    if (!item) {
        return key;
    }
    return item[currentLang] || item.ru || key;
}

export { dictionary, getCurrentLang, setLang, translate };
export type {Lang}