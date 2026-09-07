import { describe, it, expect } from 'vitest';
import {
    createPresentation,
    updatePresentationName,
    savePresentation,
    loadPresentation
} from '../functions/presentation.js';
import { addSlide } from '../functions/slide.js';
import { createDefaultSlide } from '../functions/slide.js';
import { generateId } from '../functions/utils.js';
import { Presentation } from '../types/presentation.js';

describe('createPresentation', () => {
    it('create a presentation with default slide and with generatedId', () => {
        const id = generateId()
        const defaultSlide = createDefaultSlide('slide1')
        const created = new Date()

        const presentation = createPresentation('My Presentation', defaultSlide, id, created);

        expect(presentation).toEqual({
            id,
            slides: [defaultSlide],
            name: 'My Presentation',
            access: 'linkedOnly',
            created,
            activeSlideId: 'slide1'
        })
    })
})

describe('updatePresentationName', () => {
    it('rename the presentation', () => {
        const defaultSlide = createDefaultSlide('slide1')
        const created = new Date()
        const presentation = createPresentation('First Presentation', defaultSlide, 'presentation1', created)

        const result = updatePresentationName('Oh, Presentation', presentation)
        
        expect(result.name).toBe('Oh, Presentation')
    })

    it('update name to empty', () => {
        const defaultSlide = createDefaultSlide('slide1')
        const created = new Date()
        const presentation = createPresentation('First Presentation', defaultSlide, 'presentation1', created)

        const result = updatePresentationName('', presentation)

        expect(result.name).toBe('')
    })
})

describe('savePresentation', () => {
    it('save presentation at JSON', () => {
        const defaultSlide = createDefaultSlide('slide1')
        const created = new Date()
        const presentation = createPresentation('First Presentation', defaultSlide, 'presentation1', created)
        
        const result = savePresentation(presentation)

        expect(result).toBe(JSON.stringify(presentation, null, 2))
    })
})

describe('loadPresentation', () => {
    it('load presentation from JSON', () => {
        const defaultSlide = createDefaultSlide('slide1')
        const created = new Date()
        const presentation = createPresentation('First Presentation', defaultSlide, 'presentation1', created)
        const json = savePresentation(presentation)

        const result = loadPresentation(json)

        expect(result).toEqual(presentation)
    })
    it('thows error when JSON invalid', () => {
        const invalidJSON = '{invalid json}'
        expect(() => {loadPresentation(invalidJSON)}).toThrow()
    })
})

describe('addSlide', () => {
    it('addition new slide, check default active slide', () => {
        const defaultSlide = createDefaultSlide('slide1')
        const created = new Date()
        const presentation = createPresentation('First Presentation', defaultSlide, 'presentation1', created)

        const result = addSlide(presentation, 'newSlide')


        expect(result.slides).toHaveLength(2)
        expect(result.slides[0]).toEqual(defaultSlide)
        expect(result.slides[1].id).toBe('newSlide')
        expect(result.activeSlideId).toBe('slide1')
        expect(result.slides[1].name).toBe('Слайд 2')
        expect(result.slides[0].name).toBe('Слайд 1')
    })

    it('add slide to empty presentation and make it active', () => {
        const created = new Date()
        const presentation: Presentation = {
            id: 'presentation1',
            name: 'myPres',
            access: "linkedOnly",
            created,
            slides: [],
            activeSlideId: '',
        };

        const result = addSlide(presentation, 'slide1');

        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].id).toBe('slide1');
        expect(result.slides[0].name).toBe('Слайд 1');
        expect(result.activeSlideId).toBe('slide1');
    });

    it('add slide with provided name', () => {
        const defaultSlide = createDefaultSlide('slide1', 'Слайд 1');
        const presentation = createPresentation('My Presentation', defaultSlide, 'presentation1', new Date());

        const result = addSlide(presentation, 'slide2', 'Мой слайд');

        expect(result.slides).toHaveLength(2);
        expect(result.slides[1].id).toBe('slide2');
        expect(result.slides[1].name).toBe('Мой слайд');
    });
})