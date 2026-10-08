import { describe, it, expect } from 'vitest'
import { 
    setSlideBackgroundColor, 
    setSlideBackgroundImage, 
    setSlideBackgroundGradient, 
    addTextObject, 
    addImageObject, 
    removeObject, 
    resizeObject, 
    moveObject, 
    updateTextObjectStyle, 
    clearSlideBackground
} from '../functions/objects.js'
import { createDefaultSlide } from '../functions/slide.js'
import type { TextObject } from '../types/objects.js'
import { createTestRectangle } from './object_test_functions.js'
import { createText, img } from './object_test_functions.js'

describe('setBackgroundColor', () => {
    it('sets background color', () => {
        const result = setSlideBackgroundColor(createDefaultSlide('slide1'), 'red')
        expect(result.background).toEqual({ type: 'color', color: 'red' })   
    })   
    it('returns slide if color is empty', () => {
        const slide = createDefaultSlide('slide1')   
        const newSlide = setSlideBackgroundColor(slide, '')
        expect(newSlide).toBe(slide)   
    })   
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')   
        setSlideBackgroundColor(slide, 'red')   
        expect(slide.background).toEqual({ type: 'none' })   
    })   
})   
describe('setSlideBackgroundGradient', () => {
    it('sets gradient background with colors and angle', () => {
        const slide = createDefaultSlide('slide1')
        const result = setSlideBackgroundGradient(slide, ['red', 'green'], 45)
        expect(result.background).toEqual({ 
            type: 'gradient', 
            colors: ['red', 'green'], 
            angle: 45 
        })   
    })   
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')   
        setSlideBackgroundGradient(slide, ['red', 'blue'], 45)   
        expect(slide.background).toEqual({ type: 'none' })   
    })   
})   

describe('setSlideBackgroundImage', () => {
    it('sets background image', () => {
        const slide = createDefaultSlide('slide1')
        const result = setSlideBackgroundImage(slide, 'image.jpg')
        expect(result.background).toEqual({ 
            type: 'image', 
            url: 'image.jpg' 
        })   
    })   
    it('returns slide for non-image file', () => {
        const slide = createDefaultSlide('slide1')   
        const result = setSlideBackgroundImage(slide, 'image.exe')
        expect(result).toBe(slide)   
    })   
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')   
        setSlideBackgroundImage(slide, 'image.jpg')   
        expect(slide.background).toEqual({ type: 'none' })   
    })   
})   
describe('clearSlideBackground', () => {
    it('clears background color', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithBackground = setSlideBackgroundColor(slide, 'red')   
        const result = clearSlideBackground(slideWithBackground)
        expect(result.background).toEqual({ type: 'none' })   
    })   
})   
describe('addTextObject', () => {
    it('adds text object to slide', () => {
        const slide = createDefaultSlide('slide1')
        const text = createText('text1')
        const result = addTextObject(slide, text)   
        expect(result.elements).toHaveLength(1)   
        expect(result.elements[0].id).toBe('text1')   
    })   
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1') 
        const text = createText('text1')  
        addTextObject(slide, text)   
        expect(slide.elements).toHaveLength(0)   
    })   
})   
describe('addImageObject', () => {
    it('adds image object to slide', () => {
        const slide = createDefaultSlide('slide1')
        const image = img('image1')
        const result = addImageObject(slide, image)   
        expect(result.elements).toHaveLength(1)   
    })   
    it('returns slide when url has no format', () => {
        const slide = createDefaultSlide('slide1')   
        const image = img('image1', 'image')
        const result = addImageObject(slide, image)
        expect(result).toBe(slide)   
    })   
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')  
        const image = img('image1') 
        addImageObject(slide, image)   
        expect(slide.elements).toHaveLength(0)   
    })   
})   
describe('removeObject', () => {
    it('removes object by id', () => {
        const slide = addTextObject(
            addTextObject(
                addTextObject(createDefaultSlide('slide1'), createText('text1')), 
                createText('text2')
            ), 
            createText('text3')
        )   
        const resultIds = removeObject(slide, 'text2').elements.map(e => e.id)
        expect(resultIds).toEqual(['text1', 'text3'])   
    })   
    it('returns slide if object does not exist', () => {
        const slide = createDefaultSlide('slide1')   
        const result = removeObject(slide, 'unknown')
        expect(result).toEqual(slide)   
    })   
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')
        const text = createText('text1')
        const result = addTextObject(slide, text)   
        removeObject(result, 'text1')   
        expect(result.elements).toHaveLength(1)   
    })   
})   
describe('resizeObject', () => {
    it('resizes text object', () => {
        const slide = createDefaultSlide('slide1')
        const text = createText('text1')
        const slideWithText = addTextObject(slide, text)   
        const result = resizeObject(slideWithText, 'text1', { 
            width: 50, 
            height: 90 
        })   
        expect(result.elements[0]).toMatchObject({
            size: { 
                width: 50, 
                height: 90 
            }
        })   
    })   
    it('resizes figure', () => {
        const element = createTestRectangle()
        const slide = createDefaultSlide('slide1')
        const slideWithElement = { ...slide, elements: [element] }   
        const result = resizeObject(slideWithElement, 'rectangle1', { 
            width: 100, 
            height: 80 
        })
        expect(result.elements[0]).toMatchObject({
            size: { 
                width: 100, 
                height: 80 
            }
        })   
    })   
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')
        const text = createText('text1')
        const slideWithText = addTextObject(slide, text)   
        resizeObject(slideWithText, 'text1', { 
            width: 50, 
            height: 80 
        })      
        const textElement = slideWithText.elements[0] as TextObject
        expect(textElement.size).toEqual({ 
            width: 100, 
            height: 50 })   
    })   
})   
describe('moveObject', () => {
    it('moves object to another position', () => {
        const slide = createDefaultSlide('slide1');
        const text = createText('text1')
        const slideWithText = addTextObject(slide, text)  
        const result = moveObject(slideWithText, 'text1', 50, 100) 
        expect(result.elements[0].position).toEqual({ 
            x: 50, 
            y: 100 
        })   
    })   
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')
        const text = createText('text1')
        const slideWithText = addTextObject(slide, text)   
        moveObject(slideWithText, 'text1', 50, 100)   
        expect(slideWithText.elements[0].position).toEqual({ x: 10, y: 20 })   
    })   
})   
describe('updateTextObjectStyle', () => {
    it('updates text object style', () => {
        const text = createText('text1')
        const slide = createDefaultSlide('slide1')
        const slideWithText = addTextObject(slide, text)   
        const result = updateTextObjectStyle(slideWithText, 'text1', 'Times New Roman', 20, 'red')   
        const element = result.elements[0] as TextObject   
        expect(element.style).toMatchObject({ 
            fontFamily: 'Times New Roman', 
            fontSize: 20, 
            fontColor: 'red' 
        })   
    })   
    it('does not update non-text object', () => {
        const slide = createDefaultSlide('slide1')
        const image = img('image1')
        const slideWithImage = addImageObject(slide, image)   
        const result = updateTextObjectStyle(slideWithImage, 'image1', 'Arial', 20, 'red')
        expect(result).toEqual(slide)   
    })   
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')
        const text = createText('text1')
        const result = addTextObject(slide, text)   
        updateTextObjectStyle(result, 'text1', 'Times New Roman', 20, 'red')   
        const element = result.elements[0] as TextObject   
        expect(element.style.fontFamily).toBe('Arial')   
    })   
})