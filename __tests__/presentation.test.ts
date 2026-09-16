import { describe, it, expect } from 'vitest'  
import {
    createPresentation,
    updatePresentationName,
    savePresentation,
    loadPresentation,
    updatePresentationAccess
} from '../functions/presentation.js'  
import { addSlide } from '../functions/slide.js'  
import { Presentation } from '../types/presentation.js'  

describe('createPresentation', () => {
    it('creates an empty presentation', () => {
        const id = 'presentation1'
        const created = new Date()
        const presentation = createPresentation('My Presentation', id, created)  
        expect(presentation).toEqual({
            id,
            slides: [],
            name: 'My Presentation',
            access: 'linkedOnly',
            created,
        })
    })
})

describe('updatePresentationName', () => {
    it('renames the presentation', () => {
        const created = new Date()
        const presentation = createPresentation('First Presentation', 'presentation1', created)
        const result = updatePresentationName('Oh, Presentation', presentation)
        expect(result.name).toBe('Oh, Presentation')
    })
    it('updates name to empty', () => {
        const created = new Date()
        const presentation = createPresentation('First Presentation', 'presentation1', created)
        const result = updatePresentationName('', presentation)
        expect(result.name).toBe('')
    })
    it('does not mutate the original presentation', () => {
        const presentation = createPresentation('First Presentation', 'presentation1', new Date())  
        const result = updatePresentationName('New Name', presentation)  
        expect(presentation.name).toBe('First Presentation')  
        expect(result.name).toBe('New Name')  
    })  
})

describe('savePresentation', () => {
    it('saves presentation at JSON', () => {
        const created = new Date()
        const presentation = createPresentation('First Presentation', 'presentation1', created)
        const result = savePresentation(presentation)
        expect(result).toBe(JSON.stringify(presentation, null, 2))
    })
    it('saves empty presentation', () => {
        const presentation: Presentation = {
            id: 'presentation1',
            name: 'My Pres',
            access: 'linkedOnly',
            created: new Date(),
            slides: [],
        }  
        const result = savePresentation(presentation)  
        expect(result).toBe(JSON.stringify(presentation, null, 2))  
    })  
})
describe('loadPresentation', () => {
    it('loads presentation from JSON', () => {
        const created = new Date()
        const presentation = createPresentation('First Presentation', 'presentation1', created)
        const json = savePresentation(presentation)
        const result = loadPresentation(json)
        expect(result).toEqual(presentation)
    })
    it('returns null when JSON invalid', () => {
        const invalidJSON = '{invalid json}'
        const result = loadPresentation(invalidJSON)
        expect(result).toBeNull()
    })
})
describe('addSlide', () => {
    it('adds slide to empty presentation', () => {
        const created = new Date()
        const presentation: Presentation = {
            id: 'presentation1',
            name: 'myPres',
            access: "linkedOnly",
            created,
            slides: [],
        }  
        const result = addSlide(presentation, 'slide1')  
        expect(result.slides).toHaveLength(1)  
        expect(result.slides[0].id).toBe('slide1')  
        expect(result.slides[0].name).toBe('Слайд 1')  
    })  
    it('adds slide with provided name', () => {
        const presentation = createPresentation('My Presentation', 'presentation1', new Date())  
        const withFirstSlide = addSlide(presentation, 'slide1', 'Слайд 1')  
        const result = addSlide(withFirstSlide, 'slide2', 'Мой слайд')  
        expect(result.slides).toHaveLength(2)  
        expect(result.slides[1].id).toBe('slide2')  
        expect(result.slides[1].name).toBe('Мой слайд')  
    })  
    it('does not mutate the original presentation', () => {
        const presentation = createPresentation('First Presentation', 'presentation1', new Date())  
        const presentationWithFirstSlide = addSlide(presentation, 'slide1')  
        const result = addSlide(presentationWithFirstSlide, 'slide2')  
        expect(presentationWithFirstSlide.slides).toHaveLength(1)  
        expect(presentationWithFirstSlide.slides[0].id).toBe('slide1')  
        expect(result.slides).toHaveLength(2)  
        expect(result.slides[1].id).toBe('slide2')  
    })  
})
describe('updatePresentationAccess', () => {
    it('updates presentation access to public', () => {
        const presentation = createPresentation('My Pres', 'presentation1', new Date())  
        const result = updatePresentationAccess(
            presentation,
            'public'
        )  
        expect(result.access).toBe('public')  
    })  

    it('updates presentation access to linkedOnly', () => {
        const presentation = createPresentation('My Pres', 'presentation1', new Date())  
        const result = updatePresentationAccess(presentation, 'linkedOnly')  
        expect(result.access).toBe('linkedOnly')  
    })  
    it('does not mutate the original presentation', () => {
        const presentation = createPresentation('My Pres', 'presentation1', new Date())  
        const result = updatePresentationAccess(
            presentation,
            'public'
        )  
        expect(presentation.access).toBe('linkedOnly')  
        expect(result.access).toBe('public')  
    })  
})  