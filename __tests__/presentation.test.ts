import { describe, it, expect } from 'vitest';
import {
    createPresentation,
    updatePresentationName,
    savePresentation,
    loadPresentation
} from '../functions/presentation.js';
import { addSlide } from '../functions/slide.js';
import { createDefaultSlide } from '../functions/slide.js';

describe('createPresentation', () => {
    it('create a presentation with default slide', () => {
        const defaultSlide = createDefaultSlide('slide1')
        const created = new Date()

        const presentation = createPresentation('My Presentation', defaultSlide, 'presentation1', created);

        expect(presentation).toEqual({
            id: 'presentation1',
            slides: [defaultSlide],
            name: 'My Presentation',
            secure: 'linkedOnly',
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
    })
})