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

const createTestPresentation = () => {
    const base = createPresentation('My Pres', 'presentation1', new Date());
    return addSlide(addSlide(addSlide(base, 'slide1'), 'slide2'), 'slide3');
};

describe('createDefaultSlide', () => {
    it('creates new default slide without name', () => {
        const id = 'slide1';
        const slide = createDefaultSlide(id);
        expect(slide.id).toBe('slide1');
        expect(slide.name).toBe('Слайд 1');
        expect(slide.number).toBe(1);
        expect(slide.elements).toEqual([]);
    })
    it('creates deafault slide with name', () => {
        const id = 'slide1'
        const name = 'My Name'
        const slide = createDefaultSlide(id, name);
        expect(slide.name).toBe('My Name')
    })
})
describe('removeSlide', () => {
    it('removes slide by id', () => {
        const presentation = createPresentation('My Pres', 'presentation1', new Date());
        const presentationWithSlides = addSlide(addSlide(presentation, 'slide1'), 'slide2');
        const result = removeSlide(presentationWithSlides, 'slide1');
        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].id).toBe('slide2');
    });
    it('returns presentation if slide does not exist', () => {
        const presentation = addSlide(createPresentation('My Pres', 'presentation1', new Date()), 'slide1');
        const result = removeSlide(presentation, 'unknown');
        expect(result.slides).toHaveLength(1);
    });
    it('does not mutate original presentation', () => {
        const presentation = addSlide(addSlide(createPresentation('My Pres', 'presentation1', new Date()), 'slide1'), 'slide2');
        removeSlide(presentation, 'slide1');
        expect(presentation.slides).toHaveLength(2);
    });
});

describe('moveSlide', () => {
    it('moves slide to another position', () => {
        const presentation = createTestPresentation();
        const result = moveSlide(presentation, 'slide2', 2);
        expect(result.slides.map(s => s.id)).toEqual(['slide1', 'slide3', 'slide2']);
    });
    it('moves last slide to first position', () => {
        const presentation = createTestPresentation();
        const result = moveSlide(presentation, 'slide3', 0);
        expect(result.slides.map(s => s.id)).toEqual(['slide3', 'slide1', 'slide2']);
    });
    it('moves slide to the same position', () => {
        const presentation = createTestPresentation();
        const result = moveSlide(presentation, 'slide2', 1);
        expect(result.slides.map(s => s.id)).toEqual(['slide1', 'slide2', 'slide3']);
    });
    it('returns presentation if slide does not exist', () => {
        const presentation = createTestPresentation();
        const result = moveSlide(presentation, 'unknown', 1);
        expect(result.slides.map(s => s.id)).toEqual(['slide1', 'slide2', 'slide3']);
    });
    it('does not mutate original presentation', () => {
        const presentation = createTestPresentation();
        moveSlide(presentation, 'slide1', 2);
        expect(presentation.slides.map(s => s.id)).toEqual(['slide1', 'slide2', 'slide3']);
    });
});
describe('duplicateSlide', () => {
    it('duplicates slide and inserts after original', () => {
        const presentation = createTestPresentation();
        const result = duplicateSlide(presentation, presentation.slides[1], 'slide2-copy');
        expect(result.slides).toHaveLength(4);
        expect(result.slides.map(s => s.id)).toEqual(['slide1', 'slide2', 'slide2-copy', 'slide3']);
    });
    it('duplicates first slide', () => {
        const presentation = createTestPresentation();
        const result = duplicateSlide(presentation, presentation.slides[0], 'slide1-copy');
        expect(result.slides.map(s => s.id)).toEqual(['slide1', 'slide1-copy', 'slide2', 'slide3']);
    });
    it('duplicates last slide', () => {
        const presentation = createTestPresentation();
        const result = duplicateSlide(presentation, presentation.slides[2], 'slide3-copy');
        expect(result.slides.map(s => s.id)).toEqual(['slide1', 'slide2', 'slide3', 'slide3-copy']);
    });
    it('returns presentation if slide does not exist', () => {
        const presentation = createTestPresentation();
        const unknownSlide = createDefaultSlide('unknown');
        const result = duplicateSlide(presentation, unknownSlide, 'unknown-copy');
        expect(result.slides).toHaveLength(3);
    });
});