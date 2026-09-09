import { describe, it, expect } from 'vitest'
import { 
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground,
    addTextObject,
    addImageObject,
    removeObject,
    resizeObject,
    moveObject,
    updateTextObjectStyle 
} from '../functions/objects.js'
import { createDefaultSlide } from '../functions/slide.js'
import type { Slide } from './slide.test.js'
import type { SlideObject } from '../types/objects.js'

describe('setBackgroundColor', () => {
    it('sets background color', () => {
        const slide = createDefaultSlide('slide1')
    
        const result = setSlideBackgroundColor(slide, 'red')

        expect(result.background).toEqual({
            type: 'color',
            color: 'red'
        })
    })
    it('sets empty color', () => {
        const slide = createDefaultSlide('slide1')
        
        const result = setSlideBackgroundColor(slide, '')

        expect(result).toEqual(slide)
    })
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')

        const result = setSlideBackgroundColor(slide, 'red')

        expect(slide.background).toEqual({
            type: 'none'
        })
        expect(result.background).toEqual({
            type: 'color',
            color: 'red'
        })
    })
})

describe('setSlideBackgroundGradient', () => {
    it('sets gradient background with colors and angle', () => {
        const slide = createDefaultSlide('slide1')

        const result = setSlideBackgroundGradient(
            slide,
            ['red', 'green', 'blue'],
            45
        )

        expect(result.background).toEqual({
            type: 'gradient',
            colors: ['red', 'green', 'blue'],
            angle: 45
        })
    })
    it('sets default angle when angle is not provided', () => {
        const slide = createDefaultSlide('slide1')

        const result = setSlideBackgroundGradient(
            slide,
            ['red', 'green', 'blue']
        )

        expect(result.background).toEqual({
            type: 'gradient',
            colors: ['red', 'green', 'blue'],
            angle: 0
        })
    })
    it('replaces current color with gradient', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithColor = setSlideBackgroundColor(slide, 'red')

        const result = setSlideBackgroundGradient(slideWithColor, ['red', 'blue', 'orange'])

        expect(result.background).toEqual({
            type: 'gradient',
            colors: ['red', 'blue', 'orange'],
            angle: 0
        })
    })
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')

        const result = setSlideBackgroundGradient(
            slide,
            ['red', 'blue'],
            45
        )

        expect(slide.background).toEqual({
            type: 'none'
        })
        expect(result.background).toEqual({
            type: 'gradient',
            colors: ['red', 'blue'],
            angle: 45
        })
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
    it('does not add background for non-image file', () => {
        const slide = createDefaultSlide('slide1')

        const result = setSlideBackgroundImage(slide, 'image.exe')

        expect(result).toEqual(slide)
    })
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')

        const result = setSlideBackgroundImage(slide, 'image.jpg')

        expect(slide.background).toEqual({
            type: 'none'
        })
        expect(result.background).toEqual({
            type: 'image',
            url: 'image.jpg'
        })
    })
})

describe('clearSlideBackground', () => {
    it('clears background color', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithColor = setSlideBackgroundColor(slide, 'red')

        const result = clearSlideBackground(slideWithColor)

        expect(result).toEqual(slide)
    })
    it('clears empty slide', () => {
        const slide = createDefaultSlide('slide1')

        const result = clearSlideBackground(slide)

        expect(result).toEqual(slide)
    })
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithColor = setSlideBackgroundColor(slide, 'red')

        const result = clearSlideBackground(slideWithColor)

        expect(slideWithColor.background).toEqual({
            type: 'color',
            color: 'red'
        })
        expect(result.background).toEqual({
            type: 'none'
        })
    })
})

describe('addTextObject', () => {
    it('adds text object to slide', () => {
        const slide = createDefaultSlide('slide1')

        const result = addTextObject(slide, 'Hello World!', 10, 20, 100, 50, 'Arial', 20, 'black', 'text1')

        expect(result.elements).toHaveLength(1)
        expect(result.elements[0]).toEqual({
                id: 'text1',
                position: {
                    x: 10,
                    y: 20
                },
                type: 'text',
                layer: 0,
                content: 'Hello World!',
                width: 100,
                height: 50,
                style: {
                    fontFamily: 'Arial',
                    fontSize: 20,
                    fontColor: 'black',
                    bold: false,
                    italic: false,
                    underline: false,
                    fillColor: 'transparent',
                    textAlign: 'left'
                }
            })
    })
    it('adds next text object with next layer', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithFirstObject = addTextObject(slide, 'Hello World!', 10, 20, 50, 100, 'Arial', 14, 'black', 'text1')

        const result = addTextObject(slideWithFirstObject, 'And you :)', 10, 20, 50, 100, 'Arial', 14, 'black', 'text2')

        expect(result.elements).toHaveLength(2)
        expect(result.elements[1].id).toBe('text2')
        expect(result.elements[1].layer).toBe(1)
        expect(result.elements[0].layer).toBe(0)
    })
    it('does not mutate the in coming slide', () => {
        const slide = createDefaultSlide('slide1')

        const result = addTextObject(slide, 'Hello', 10, 20, 50, 100, 'Arial', 14, 'black', 'text1')

        expect(slide.elements).toHaveLength(0)
        expect(result.elements).toHaveLength(1)
    })
})

describe('addImageObject', () => {
    it('adds image object to slide', () => {
        const slide = createDefaultSlide('slide1')
        
        const result = addImageObject(slide, 'image.img', 10, 20, 50, 100, 'image1')

        expect(result.elements).toHaveLength(1)
    })
    it('adds next image object with next layer', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithFirstObject = addImageObject(slide, 'image.png', 10, 20, 50, 100, 'image1')
        
        const result = addImageObject(slideWithFirstObject, 'picture.img', 10, 400, 20, 10, 'image2')

        expect(result.elements).toHaveLength(2)
        expect(result.elements[0].layer).toBe(0)
        expect(result.elements[1].layer).toBe(1)
        expect(result.elements[1].id).toBe('image2')
    })
    it('does not add object when url has no format', () => {
        const slide = createDefaultSlide('slide1')
        
        const result = addImageObject(slide, 'image', 19, 30, 21, 14, 'image1')

        expect(result).toEqual(slide)
    })
    it('adds image object with zero position and size', () => {
        const slide = createDefaultSlide('slide1')
        
        const result = addImageObject(slide, 'image.jpg', 0, 0, 0, 0, 'image1')
        expect(result.elements[0]).toEqual({
            id: 'image1',
            position: {
                x: 0,
                y: 0
            },
            type: 'image',
            layer: 0,
            width: 0,
            height: 0,
            url: 'image.jpg'
        })
    })
    it('does not mutated incoming slide', () => {
        const slide = createDefaultSlide('slide1')

        const result = addImageObject(slide, 'image.jpg', 10, 20, 100, 50, 'image1')

        expect(slide.elements).toHaveLength(0)
        expect(result.elements).toHaveLength(1)
    })
})

describe('removeObject', () => {
    it('removes first object from slide', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithFirstObject = addTextObject(slide, 'First', 10, 20, 100, 50, 'Arial', 20, 'black', 'text1')
        const slideWithTwoObjects = addTextObject(slideWithFirstObject, 'Second', 20, 30, 100, 50, 'Arial', 20, 'black', 'text2')

        const result = removeObject(slideWithTwoObjects, 'text1')

        expect(result.elements).toHaveLength(1)
        expect(result.elements[0].id).toBe('text2')
    })
    it('removes middle object from slide', () => {
        const slide = createDefaultSlide('slide1')
        const slide1 = addTextObject(slide, 'First', 10, 20, 100, 50, 'Arial', 20, 'black', 'text1')
        const slide2 = addTextObject(slide1, 'Second', 20, 30, 100, 50, 'Arial', 20, 'black', 'text2')
        const slide3 = addTextObject(slide2, 'Third', 30, 40, 100, 50, 'Arial', 20, 'black', 'text3')

        const result = removeObject(slide3,'text2')

        expect(result.elements.map(object => object.id)).toEqual([
            'text1',
            'text3'
        ])
    })
    it('removes last object from slide', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithFirstObject = addTextObject(slide, 'First', 10, 20, 30, 40, 'Arial', 14, 'black', 'object1')
        const slideWithSecondObject = addTextObject(slideWithFirstObject, 'Second', 10, 20, 30, 40, 'Arial', 20, 'blue', 'object2')
        
        const result = removeObject(slideWithSecondObject, 'object2')

        expect(result.elements).toHaveLength(1)
        expect(result.elements[0].id).toBe('object1')
    })
    it('returns slide if object does not exist', () => {
        const slide = createDefaultSlide('slide1')

        const result = removeObject(slide, 'unknown')

        expect(result).toEqual(slide)
    })
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addTextObject(slide, 'Hello', 10, 20, 100, 50, 'Arial', 20, 'black', 'text1' )

        removeObject(slideWithObject, 'text1')

        expect(slideWithObject.elements).toHaveLength(1)
        expect(slideWithObject.elements[0].id).toBe('text1')
    })
})

function createTestTriangle(): SlideObject {
    return {
        id: 'triangle1',
        points: [
            { x: 10, y: 10 },
            { x: 15, y: 15 },
            { x: 18, y: 0 }
        ],
        position: {
            x: 10,
            y: 20
        },
        type: 'figure',
        layer: 0,
        typeFigure: 'triangle',
        borderColor: 'black',
        width: 30,
        height: 40,
        fillColor: 'red'
    }
}

function createTestCircle(): SlideObject {
    return {
        id: 'circle1',
        position: {
            x: 10,
            y: 20
        },
        type: 'figure',
        layer: 0,
        typeFigure: 'circle',
        borderColor: 'black',
        radius: 50,
        fillColor: 'red'
    }
}

function createTestRectangle(): SlideObject {
    return {
        id: 'rectangle1',
        position: {
            x: 10,
            y: 20
        },
        type: 'figure',
        layer: 0,
        typeFigure: 'rectangle',
        borderColor: 'black',
        width: 30,
        height: 40,
        fillColor: 'red'
    }
}


describe('resizeObject', () => {
    it('resizes text object', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addTextObject(slide, 'Hello', 10, 20, 30, 40, 'Arial', 14, 'blue', 'text1')

        const result = resizeObject(slideWithObject, 'text1', { width: 50, height: 90 })
        
        expect(result.elements[0]).toMatchObject({
            type: 'text',
            width: 50,
            height: 90
        })
    })
    it('resizes image object', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addImageObject(slide, 'hello.img', 10, 20, 30, 40, 'image1')

        const result = resizeObject(slideWithObject, 'image1', {width: 50, height: 90})
        const element = result.elements[0]
        expect(result.elements[0]).toMatchObject({
            type: 'image',
            width: 50,
            height: 90
        })
    })
    it('resizes circle by radius', () => {
        const slide = createDefaultSlide('slide1')
        const circle = createTestCircle();
        const slideWithCircle: Slide = {
            ...slide,
            elements: [circle]
        }

        const result = resizeObject(slideWithCircle, 'circle1', {width: 100, height: 100})
        const element = result.elements[0]
        expect(result.elements[0]).toMatchObject({
            type: 'figure',
            typeFigure: 'circle',
            radius: 50
        })
    })
    it('resizes rectangle', () => {
        const slide = createDefaultSlide('slide1')
        const rectangle: SlideObject = createTestRectangle()
        const slideWithRectangle: Slide = {
            ...slide,
            elements: [rectangle]
        }

        const result = resizeObject(slideWithRectangle, 'rectangle1', {width: 100, height: 80})
        const element = result.elements[0]
        expect(result.elements[0]).toMatchObject({
            type: 'figure',
            typeFigure: 'rectangle',
            width: 100,
            height: 80
        })
    })
    it('resizes triangle', () => {
        const slide = createDefaultSlide('slide1')
        const rectangle: SlideObject = createTestTriangle()
        const slideWithRectangle: Slide = {
            ...slide,
            elements: [rectangle]
        }

        const result = resizeObject(slideWithRectangle, 'triangle1', {width: 100, height: 80})
        const element = result.elements[0]
        expect(result.elements[0]).toMatchObject({
            type: 'figure',
            typeFigure: 'triangle',
            width: 100,
            height: 80
        })
    })
    it('returns slide if object does not exist', () => {
        const slide = createDefaultSlide('slide1')

        const result = resizeObject(slide, 'unknow', {width: 100, height: 10})

        expect(result).toEqual(slide)
    })
    it('does not mutate the original data', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addTextObject(slide, 'Hello', 10, 20, 30, 40, 'Arial', 14, 'blue', 'text1')
        resizeObject(slideWithObject, 'text1', {width: 50, height: 80})

        const element = slideWithObject.elements[0]
        expect(slideWithObject.elements[0]).toMatchObject({
            type: 'text',
            width: 30,
            height: 40
        })
    })
})

describe('moveObject', () => {
    it('moves object to another position', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addTextObject(slide, 'Hello', 10, 20, 100, 50, 'Arial', 14, 'black', 'text1')

        const result = moveObject(slideWithObject, 'text1', 50, 100)

        expect(result.elements[0]).toMatchObject({
            type: 'text',
            position: {
                x: 50,
                y: 100
            }
        })
    })
    it('returns slide if object does not exist', () => {
        const slide = createDefaultSlide('slide1')
        const result = moveObject(
            slide,
            'unknown',
            50,
            100
        )

        expect(result).toEqual(slide)
    })
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addTextObject(slide, 'Hello', 10, 20, 100, 50, 'Arial', 14, 'black', 'text1')
        const result = moveObject(slideWithObject, 'text1', 50, 100)

        expect(slideWithObject.elements[0]).toMatchObject({
            type: 'text',
            position: {
                x: 10,
                y: 20
            }
        })

        expect(result.elements[0]).toMatchObject({
            type: 'text',
            position: {
                x: 50,
                y: 100
            }
        })
    })
})

describe('updateTextObjectStyles', () => {
    it('updates text object style', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithText = addTextObject(slide, 'Hello', 10, 20, 100, 50, 'Arial', 14, 'black', 'text1')

        const result = updateTextObjectStyle(slideWithText, 'text1', 'Times New Roman', 20, 'red')

        const element = result.elements[0]
        if (element.type !== 'text') {
            throw Error('Invalid type')
        }

        expect(element.style.fontFamily).toBe('Times New Roman')
        expect(element.style.fontSize).toBe(20)
        expect(element.style.fontColor).toBe('red')
    })
    it('does not update non-text object', () => {
        const slide = createDefaultSlide('slide1');
        const slideWithImage = addImageObject(slide, 'image.jpg', 10, 20, 100, 50, 'image1');

        const result = updateTextObjectStyle(slideWithImage, 'image1', 'Arial', 20, 'red');

        expect(result).toEqual(slideWithImage);
    })
    it('returns slide if object does not exist', () => {
        const slide = createDefaultSlide('slide1')

        const result = updateTextObjectStyle(slide, 'unknown', 'Arial', 20, 'red')

        expect(result).toEqual(slide)
    })
    it('does not mutate the original slide', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithText = addTextObject(slide, 'Hello', 10, 20, 100, 50, 'Arial', 14, 'red', 'text1')
        updateTextObjectStyle(slideWithText, 'text1', 'Arial', 120, 'blue')
        const element = slideWithText.elements[0]
        if (element.type !== 'text') {
            throw Error('Invalid type')
        }

        expect(element.style.fontFamily).toBe('Arial')
        expect(element.style.fontSize).toBe(14)
        expect(element.style.fontColor).toBe('red')
    })
})