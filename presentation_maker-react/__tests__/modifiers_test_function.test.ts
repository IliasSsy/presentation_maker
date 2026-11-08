import { describe, it, expect } from 'vitest';
import { deleteSlideModifier, removeSelectedObjectsModifier } from '../src/modules/modifiers.ts';
import type { EditorState } from '../src/modules/editor.ts';

const createTextObject = (id: string) => ({
    id,
    type: 'text' as const,
    layer: 1,
    position: { x: 0, y: 0 },
    size: { width: 10, height: 10 },
    content: 'test',
    style: {
        fontFamily: 'Arial',
        fontSize: 14,
        fontColor: '#000000',
        bold: false,
        italic: false,
        underline: false,
        fillColor: 'none',
        textAlign: 'left' as const
    }
});

const createImageObject = (id: string) => ({
    id,
    type: 'image' as const,
    layer: 1,
    position: { x: 0, y: 0 },
    size: { width: 10, height: 10 },
    url: 'https://example.com/image.png'
});

describe('deleteSlideModifier', () => {
    it('switches activeSlideId to the first remaining slide if active slide is deleted', () => {
        const initialState: EditorState = {
            presentation: {
                id: 'test-id',
                name: 'Test Presentation',
                access: 'private',
                created: new Date(),
                slides: [
                    { id: 'slide-1', number: 1, elements: [], notice: '', background: { type: 'solid', color: '#ffffff' } },
                    { id: 'slide-2', number: 2, elements: [], notice: '', background: { type: 'solid', color: '#ffffff' } },
                    { id: 'slide-3', number: 3, elements: [], notice: '', background: { type: 'solid', color: '#ffffff' } }
                ]
            },
            activeSlideId: 'slide-2',
            isPreviewMode: false
        };
        const result = deleteSlideModifier(initialState, 'slide-2');
        expect(result.presentation.slides).toHaveLength(2);
        expect(result.presentation.slides.find(object => object.id === 'slide-2')).toBeUndefined();
        expect(result.activeSlideId).toBe('slide-1');
    });

    it('does not change activeSlideId if deleted slide is not currently active', () => {
        const initialState: EditorState = {
            presentation: {
                id: 'test-id',
                name: 'Test Presentation',
                access: 'private',
                created: new Date(),
                slides: [
                    { id: 'slide-1', number: 1, elements: [], notice: '', background: { type: 'solid', color: '#ffffff' } },
                    { id: 'slide-2', number: 2, elements: [], notice: '', background: { type: 'solid', color: '#ffffff' } },
                    { id: 'slide-3', number: 3, elements: [], notice: '', background: { type: 'solid', color: '#ffffff' } }
                ]
            },
            activeSlideId: 'slide-1',
            isPreviewMode: false
        };
        const result = deleteSlideModifier(initialState, 'slide-3');
        expect(result.activeSlideId).toBe('slide-1');
    });
    it('returns original state if presentation has only one slide', () => {
        const initialState: EditorState = {
            presentation: {
                id: 'test-id',
                name: 'Test Presentation',
                access: 'private',
                created: new Date(),
                slides: [
                    { id: 'slide-1', number: 1, elements: [], notice: '', background: { type: 'solid', color: '#ffffff' } }
                ]
            },
            activeSlideId: 'slide-1',
            isPreviewMode: false
        };
        const result = deleteSlideModifier(initialState, 'slide-1');
        expect(result.presentation.slides).toHaveLength(1);
        expect(result.activeSlideId).toBe('slide-1');
        expect(result).toBe(initialState);
    });
});
describe('removeSelectedObjectsModifier', () => {
    it('removes a single selected object from the active slide', () => {
        const initialState: EditorState = {
            presentation: {
                id: 'test-id',
                name: 'Test Presentation',
                access: 'private',
                created: new Date(),
                slides: [
                    { 
                        id: 'slide-1', 
                        number: 1, 
                        notice: '', 
                        background: { type: 'solid', color: '#ffffff' },
                        elements: [
                            createTextObject('obj-1'),
                            createImageObject('obj-2')
                        ]
                    }
                ]
            },
            activeSlideId: 'slide-1',
            isPreviewMode: false
        };
        const result = removeSelectedObjectsModifier(initialState, ['obj-1']);
        const updatedSlide = result.presentation.slides.find(s => s.id === 'slide-1');
        expect(updatedSlide?.elements).toHaveLength(1);
        expect(updatedSlide?.elements[0].id).toBe('obj-2');
    });
    it('removes multiple selected objects at once', () => {
        const initialState: EditorState = {
            presentation: {
                id: 'test-id',
                name: 'Test Presentation',
                access: 'private',
                created: new Date(),
                slides: [
                    { 
                        id: 'slide-1', 
                        number: 1, 
                        notice: '', 
                        background: { type: 'solid', color: '#ffffff' },
                        elements: [
                            createTextObject('obj-1'),
                            createImageObject('obj-2'),
                            createTextObject('obj-3')
                        ]
                    }
                ]
            },
            activeSlideId: 'slide-1',
            isPreviewMode: false
        };
        const result = removeSelectedObjectsModifier(initialState, ['obj-1', 'obj-3']);
        const updatedSlide = result.presentation.slides.find(s => s.id === 'slide-1');
        expect(updatedSlide?.elements).toHaveLength(1);
        expect(updatedSlide?.elements.find(obj => obj.id === 'obj-1')).toBeUndefined();
        expect(updatedSlide?.elements.find(obj => obj.id === 'obj-3')).toBeUndefined();
        expect(updatedSlide?.elements[0].id).toBe('obj-2');
    });
    it('does not change the slide if the selected objects array is empty', () => {
        const initialState: EditorState = {
            presentation: {
                id: 'test-id',
                name: 'Test Presentation',
                access: 'private',
                created: new Date(),
                slides: [
                    { 
                        id: 'slide-1', 
                        number: 1, 
                        notice: '', 
                        background: { type: 'solid', color: '#ffffff' },
                        elements: [
                            createTextObject('obj-1'),
                            createImageObject('obj-2')
                        ]
                    }
                ]
            },
            activeSlideId: 'slide-1',
            isPreviewMode: false
        };
        const result = removeSelectedObjectsModifier(initialState, []);
        const updatedSlide = result.presentation.slides.find(s => s.id === 'slide-1');
        expect(updatedSlide?.elements).toHaveLength(2);
    });
});