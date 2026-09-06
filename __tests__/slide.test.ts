import { describe, it, expect } from 'vitest';
import { generateId } from '../functions/utils.js';
import { 
        createDefaultSlide,
        removeSlide,
        moveSlide,
        setActiveSlide,
        duplicateSlide,
} from '../functions/slide.js';
import { createPresentation } from '../functions/presentation.js';
export type {Slide} from '../types/slide.js'


describe('createDefaultSlide', () => {
    it('create new default slide without name', () => {
        const id = generateId();
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
        const id = generateId();
        const name = 'My Name'

        const slide = createDefaultSlide(id, name);
        expect(slide.name).toBe('My Name')
    })
})

describe('removeSlide', () => {
    it('remove only one of one slide from presentation', () => {
        const id = generateId();
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

        const presentation = createPresentation(
            'My Pres',
            slide1,
            'presentation1',
            new Date()
        );

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
        const presentation = createPresentation(
            'My Pres',
            slide1,
            'presentation1',
            new Date()
        );
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
        const presentation = createPresentation(
            'My Pres',
            slide1,
            'presentation1',
            new Date()
        );
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
        const presentation = createPresentation(
            'My Pres',
            slide1,
            'presentation1',
            new Date()
        );
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
        const presentation = createPresentation(
            'My Pres',
            slide1,
            'presentation1',
            new Date()
        );

        const result = removeSlide(presentation, 'unknown');

        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].id).toBe('slide1');
        expect(result.activeSlideId).toBe('slide1');
    });

});

describe('moveSlide', () => {
    it()
})