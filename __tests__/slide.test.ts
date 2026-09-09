import { describe, it, expect } from 'vitest';
import { 
        createDefaultSlide,
        removeSlide,
        moveSlide,
        duplicateSlide,
        addSlide,
} from '../functions/slide.js';
import { createPresentation } from '../functions/presentation.js';
export type {Slide} from '../types/slide.js'


describe('createDefaultSlide', () => {
    it('create new default slide without name', () => {
        const id = 'slide1';
        const slide = createDefaultSlide(id);
        expect(slide).toEqual({
                    id,
                    name: 'Слайд 1',
                    number: 1,
            background: { type: 'none' },
            elements: [],
            notice: 'Введите текст для заметок',
                })
    })
    it('create deafault slide with name', () => {
        const id = 'slide1'
        const name = 'My Name'

        const slide = createDefaultSlide(id, name);
        expect(slide.name).toBe('My Name')
    })
})

describe('removeSlide', () => {
    it('remove only one of one slide from presentation', () => {
        const id = 'presentation1';
        const slide = createDefaultSlide(id);
        const created = new Date();
        const presentation = createPresentation(
            'My Pres',
            slide,
            'presentation1',
            created
        );

        const result = removeSlide(presentation, id);

        expect(result.slides).toHaveLength(0);
        expect(result.activeSlideId).toBe('');
    });
    it('remove first slide and activate next slide', () => {
        const slide1 = createDefaultSlide('slide1', 'Слайд 1');
        const slide2 = createDefaultSlide('slide2', 'Слайд 2');
        const presentation = createPresentation('My Pres', slide1, 'presentation1', new Date());
        const presentationWithSlides = {
            ...presentation,
            slides: [slide1, slide2],
            activeSlideId: 'slide1',
        };

        const result = removeSlide(presentationWithSlides, 'slide1');

        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].id).toBe('slide2');
        expect(result.activeSlideId).toBe('slide2');
    });

    it('remove middle slide and activate next slide', () => {
        const slide1 = createDefaultSlide('slide1', 'Слайд 1');
        const slide2 = createDefaultSlide('slide2', 'Слайд 2');
        const slide3 = createDefaultSlide('slide3', 'Слайд 3');
        const presentation = createPresentation('My Pres', slide1, 'presentation1', new Date());
        const presentationWithSlides = {
            ...presentation,
            slides: [slide1, slide2, slide3],
            activeSlideId: 'slide2',
        };

        const result = removeSlide(presentationWithSlides, 'slide2');

        expect(result.slides).toHaveLength(2);
        expect(result.slides[0].id).toBe('slide1');
        expect(result.slides[1].id).toBe('slide3');
        expect(result.activeSlideId).toBe('slide3');
    });
    it('remove last slide and activate previous slide', () => {
        const slide1 = createDefaultSlide('slide1', 'Слайд 1');
        const slide2 = createDefaultSlide('slide2', 'Слайд 2');
        const presentation = createPresentation('My Pres', slide1, 'presentation1', new Date());
        const presentationWithSlides = {
            ...presentation,
            slides: [slide1, slide2],
            activeSlideId: 'slide2',
        };

        const result = removeSlide(presentationWithSlides, 'slide2');

        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].id).toBe('slide1');
        expect(result.activeSlideId).toBe('slide1');
    });

    it('remove inactive slide and keep active slide', () => {
        const slide1 = createDefaultSlide('slide1', 'Слайд 1');
        const slide2 = createDefaultSlide('slide2', 'Слайд 2');
        const slide3 = createDefaultSlide('slide3', 'Слайд 3');
        const presentation = createPresentation('My Pres', slide1, 'presentation1', new Date());
        const presentationWithSlides = {
            ...presentation,
            slides: [slide1, slide2, slide3],
            activeSlideId: 'slide1',
        };

        const result = removeSlide(presentationWithSlides, 'slide2');

        expect(result.slides).toHaveLength(2);
        expect(result.activeSlideId).toBe('slide1');
    });

    it('return presentation if slide does not exist', () => {
        const slide1 = createDefaultSlide('slide1', 'Слайд 1');
        const presentation = createPresentation('My Pres', slide1, 'presentation1', new Date());

        const result = removeSlide(presentation, 'unknown');

        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].id).toBe('slide1');
        expect(result.activeSlideId).toBe('slide1');
    });
    it('does not mutate original presentation', () => {
        const slide1 = createDefaultSlide('slide1', 'Слайд 1');
        const slide2 = createDefaultSlide('slide2', 'Слайд 2');
        const presentation = createPresentation('My Pres', slide1, 'presentation1', new Date());
        const presentationWithSlides = {
            ...presentation,
            slides: [slide1, slide2],
            activeSlideId: 'slide1',
        };

        removeSlide(presentationWithSlides, 'slide2');

        expect(presentationWithSlides.slides).toHaveLength(2);
        expect(presentationWithSlides.slides[0].id).toBe('slide1');
        expect(presentationWithSlides.slides[1].id).toBe('slide2');
        expect(presentationWithSlides.activeSlideId).toBe('slide1');
    });

});

describe('moveSlide', () => {
    it('move slide to another position', () => {
        const firstSlide = createDefaultSlide('slide1', 'Слайд 1')
        const presentation = createPresentation('My Pres', firstSlide, 'presentation1', new Date())
        const presentation2 = addSlide(presentation, 'slide2');
        const presentation3 = addSlide(presentation2, 'slide3');
        const result = moveSlide(presentation3, 'slide2', 2);
        expect(result.slides.map(slide => slide.id)).toEqual([
            'slide1',
            'slide3',
            'slide2'
        ])
    })
    it('move last slide to first position', () => {
        const firstSlide = createDefaultSlide('slide1', 'Слайд 1')
        const presentation = createPresentation('My Pres', firstSlide, 'presentation1', new Date())
        const presentation2 = addSlide(presentation, 'slide2')
        const presentation3 = addSlide(presentation2, 'slide3')

        const result = moveSlide(presentation3, 'slide3', 0)

        expect(result.slides.map(slide => slide.id)).toEqual([
            'slide3',
            'slide1',
            'slide2'
        ])
    })
    it('move middle slide to another position', () => {
        const firstSlide = createDefaultSlide('slide1', 'Слайд 1');
        const presentation = createPresentation('My Pres', firstSlide, 'presentation1', new Date());
        const presentation2 = addSlide(presentation, 'slide2');
        const presentation3 = addSlide(presentation2, 'slide3');

        const result = moveSlide(presentation3, 'slide2', 2);

        expect(result.slides.map(slide => slide.id)).toEqual([
            'slide1',
            'slide3',
            'slide2'
        ]);
    });
    it('move slide to the same position', () => {
        const firstSlide = createDefaultSlide('slide1', 'Слайд 1');
        const presentation = createPresentation('My Pres', firstSlide, 'presentation1', new Date());
        const presentation2 = addSlide(presentation, 'slide2');
        const presentation3 = addSlide(presentation2, 'slide3');

        const result = moveSlide(presentation3, 'slide2', 1);

        expect(result.slides.map(slide => slide.id)).toEqual([
            'slide1',
            'slide2',
            'slide3'
        ]);
    });
    it('return presentation if slide does not exist', () => {
        const firstSlide = createDefaultSlide('slide1', 'Слайд 1');
        const presentation = createPresentation('My Pres', firstSlide, 'presentation1', new Date());

        const presentation2 = addSlide(presentation, 'slide2');

        const result = moveSlide(presentation2, 'unknown', 1);
        expect(result.slides.map(slide => slide.id)).toEqual([
            'slide1',
            'slide2'
        ]);
    });
    it('does not mutate original presentation', () => {
        const firstSlide = createDefaultSlide('slide1', 'Слайд 1');
        const presentation = createPresentation('My Pres', firstSlide, 'presentation1', new Date());
        const presentation2 = addSlide(presentation, 'slide2');
        const presentation3 = addSlide(presentation2, 'slide3');

        moveSlide(presentation3, 'slide1', 2);

        expect(presentation3.slides.map(slide => slide.id)).toEqual([
            'slide1',
            'slide2',
            'slide3'
        ]);
    });
})

describe('duplicateSlide', () => {
    it('duplicate first slide', () => {
        const firstSlide = createDefaultSlide('slide1', 'Слайд 1');
        const presentation = createPresentation('My Pres', firstSlide, 'presentation1', new Date());
        const presentation2 = addSlide(presentation, 'slide2');

        const result = duplicateSlide(presentation2, firstSlide);

        expect(result.slides).toHaveLength(3);
        expect(result.slides.map(slide => slide.id)).toEqual([
            'slide1',
            'slide1',
            'slide2'
        ]);
    });
    it('duplicate middle slide', () => {
        const firstSlide = createDefaultSlide('slide1', 'Слайд 1');
        const presentation = createPresentation('My Pres', firstSlide, 'presentation1', new Date());
        const presentation2 = addSlide(presentation, 'slide2');
        const presentation3 = addSlide(presentation2, 'slide3');
        const middleSlide = presentation3.slides[1];

        const result = duplicateSlide(presentation3, middleSlide);

        expect(result.slides).toHaveLength(4);
        expect(result.slides.map(slide => slide.id)).toEqual([
            'slide1',
            'slide2',
            'slide2',
            'slide3'
        ]);
    });
    it('duplicate last slide', () => {
        const firstSlide = createDefaultSlide('slide1', 'Слайд 1');
        const presentation = createPresentation('My Pres', firstSlide, 'presentation1', new Date());
        const presentation2 = addSlide(presentation, 'slide2');
        const presentation3 = addSlide(presentation2, 'slide3');
        const lastSlide = presentation3.slides[2];

        const result = duplicateSlide(presentation3, lastSlide);

        expect(result.slides).toHaveLength(4);
        expect(result.slides.map(slide => slide.id)).toEqual([
            'slide1',
            'slide2',
            'slide3',
            'slide3'
        ]);
    });

    it('return presentation if slide does not exist', () => {
        const firstSlide = createDefaultSlide('slide1', 'Слайд 1');
        const presentation = createPresentation('My Pres', firstSlide, 'presentation1', new Date());
        const unknownSlide = createDefaultSlide('unknown', 'Unknown');

        const result = duplicateSlide(presentation, unknownSlide);

        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].id).toBe('slide1');
    });
});