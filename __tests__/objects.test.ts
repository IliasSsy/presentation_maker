import { describe, it, expect } from 'vitest'
import { setSlideBackgroundColor, setSlideBackgroundImage, setSlideBackgroundGradient, clearSlideBackground, addTextObject, addImageObject, removeObject, resizeObject, moveObject, updateTextObjectStyle } from '../functions/objects.js'
import { createDefaultSlide } from '../functions/slide.js'
import type { TextObject, ImageObject } from '../types/objects.js'
import { createTestRectangle } from './object_test_functions.js'
import { Slide } from '../types/slide.js'

const createText = (id: string, content = 'Test'): TextObject => ({
    id, position: { x: 10, y: 20 }, type: 'text', layer: 0, content,
    size: { width: 100, height: 50 },
    style: { fontFamily: 'Arial', fontSize: 14, fontColor: 'black', bold: false, italic: false, underline: false, fillColor: 'transparent', textAlign: 'left' }
});
const img = (id: string, url = 'image.jpg'): ImageObject => ({
    id, position: { x: 10, y: 20 }, type: 'image', layer: 0, size: { width: 100, height: 50 }, url
});

describe('setBackgroundColor', () => {
    it('sets background color', () => {
        expect(setSlideBackgroundColor(createDefaultSlide('slide1'), 'red').background).toEqual({ type: 'color', color: 'red' });
    });
    it('returns slide if color is empty', () => {
        const slide = createDefaultSlide('slide1');
        expect(setSlideBackgroundColor(slide, '')).toBe(slide);
    });
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1');
        setSlideBackgroundColor(slide, 'red');
        expect(slide.background).toEqual({ type: 'none' });
    });
});
describe('setSlideBackgroundGradient', () => {
    it('sets gradient background with colors and angle', () => {
        expect(setSlideBackgroundGradient(createDefaultSlide('slide1'), ['red', 'green'], 45).background)
            .toEqual({ type: 'gradient', colors: ['red', 'green'], angle: 45 });
    });
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1');
        setSlideBackgroundGradient(slide, ['red', 'blue'], 45);
        expect(slide.background).toEqual({ type: 'none' });
    });
});
describe('setSlideBackgroundImage', () => {
    it('sets background image', () => {
        expect(setSlideBackgroundImage(createDefaultSlide('slide1'), 'image.jpg').background).toEqual({ type: 'image', url: 'image.jpg' });
    });
    it('returns slide for non-image file', () => {
        const slide = createDefaultSlide('slide1');
        expect(setSlideBackgroundImage(slide, 'image.exe')).toBe(slide);
    });
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1');
        setSlideBackgroundImage(slide, 'image.jpg');
        expect(slide.background).toEqual({ type: 'none' });
    });
});
describe('clearSlideBackground', () => {
    it('clears background color', () => {
        const slide = setSlideBackgroundColor(createDefaultSlide('slide1'), 'red');
        expect(clearSlideBackground(slide).background).toEqual({ type: 'none' });
    });
});
describe('addTextObject', () => {
    it('adds text object to slide', () => {
        const result = addTextObject(createDefaultSlide('slide1'), createText('text1'));
        expect(result.elements).toHaveLength(1);
        expect(result.elements[0].id).toBe('text1');
    });
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1');
        addTextObject(slide, createText('text1'));
        expect(slide.elements).toHaveLength(0);
    });
});
describe('addImageObject', () => {
    it('adds image object to slide', () => {
        const result = addImageObject(createDefaultSlide('slide1'), img('image1'));
        expect(result.elements).toHaveLength(1);
    });
    it('returns slide when url has no format', () => {
        const slide = createDefaultSlide('slide1');
        expect(addImageObject(slide, img('image1', 'image'))).toBe(slide);
    });
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1');
        addImageObject(slide, img('image1'));
        expect(slide.elements).toHaveLength(0);
    });
});
describe('removeObject', () => {
    it('removes object by id', () => {
        const slide = addTextObject(addTextObject(addTextObject(createDefaultSlide('slide1'), createText('text1')), createText('text2')), createText('text3'));
        expect(removeObject(slide, 'text2').elements.map(e => e.id)).toEqual(['text1', 'text3']);
    });
    it('returns slide if object does not exist', () => {
        const slide = createDefaultSlide('slide1');
        expect(removeObject(slide, 'unknown')).toEqual(slide);
    });
    it('does not mutate the original slide', () => {
        const slide = addTextObject(createDefaultSlide('slide1'), createText('text1'));
        removeObject(slide, 'text1');
        expect(slide.elements).toHaveLength(1);
    });
});
describe('resizeObject', () => {
    it('resizes text object', () => {
        const slide = addTextObject(createDefaultSlide('slide1'), createText('text1'));
        expect(resizeObject(slide, 'text1', { width: 50, height: 90 }).elements[0]).toMatchObject({ width: 50, height: 90 });
    });
    it('resizes figure', () => {
        const slide = { ...createDefaultSlide('slide1'), elements: [createTestRectangle()] };
        expect(resizeObject(slide, 'rectangle1', { width: 100, height: 80 }).elements[0]).toMatchObject({ width: 100, height: 80 });
    });
    it('does not mutate the original slide', () => {
        const slide: Slide = addTextObject(createDefaultSlide('slide1'), createText('text1'));
        resizeObject(slide, 'text1', { width: 50, height: 80 });
        expect((slide.elements[0] as TextObject).size).toEqual({ width: 100, height: 50 });
    });
});
describe('moveObject', () => {
    it('moves object to another position', () => {
        const slide = addTextObject(createDefaultSlide('slide1'), createText('text1'));
        expect(moveObject(slide, 'text1', 50, 100).elements[0].position).toEqual({ x: 50, y: 100 });
    });
    it('does not mutate the original slide', () => {
        const slide = addTextObject(createDefaultSlide('slide1'), createText('text1'));
        moveObject(slide, 'text1', 50, 100);
        expect(slide.elements[0].position).toEqual({ x: 10, y: 20 });
    });
});
describe('updateTextObjectStyles', () => {
    it('updates text object style', () => {
        const slide = addTextObject(createDefaultSlide('slide1'), createText('text1'));
        const result = updateTextObjectStyle(slide, 'text1', 'Times New Roman', 20, 'red');
        const element = result.elements[0];
        if (element.type !== 'text') {
            return null;
        }
        expect(element.style).toMatchObject({ fontFamily: 'Times New Roman', fontSize: 20, fontColor: 'red' });
    });
    it('does not update non-text object', () => {
        const slide = addImageObject(createDefaultSlide('slide1'), img('image1'));
        expect(updateTextObjectStyle(slide, 'image1', 'Arial', 20, 'red')).toEqual(slide);
    });
    it('does not mutate the original slide', () => {
        const slide = addTextObject(createDefaultSlide('slide1'), createText('text1'));
        updateTextObjectStyle(slide, 'text1', 'Times New Roman', 20, 'red');
        const element = slide.elements[0];
        if (element.type !== 'text') {
            return null;
        }
        expect(element.style.fontFamily).toBe('Arial');
    });
});