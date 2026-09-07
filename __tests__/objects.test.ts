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
    it('set background color', () => {
        const slide = createDefaultSlide('slide1')
    
        const result = setSlideBackgroundColor(slide, 'red')

        expect(result.background).toEqual({
            type: 'color',
            color: 'red'
        })
    })
    it('replace current background with new color', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithColor = setSlideBackgroundColor (slide, 'blue')

        const result = setSlideBackgroundColor(slideWithColor, 'red')

        expect(result.background).toEqual({
            type: 'color',
            color: 'red'
        })
    })
    it('set empty color', () => {
        const slide = createDefaultSlide('slide1')
        
        const result = setSlideBackgroundColor(slide, '')

        expect(result).toEqual(slide)
    })
    it('keep slide data after changing background color', () => {
        const slide = createDefaultSlide('slide1')

        const result = setSlideBackgroundColor(slide, 'red')

        expect(result.id).toEqual(slide.id)
        expect(result.name).toEqual(slide.name)
        expect(result.number).toEqual(slide.number)
        expect(result.elements).toEqual(slide.elements)
        expect(result.notice).toEqual(slide.notice)
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
    it('set gradient background with colors and angle', () => {
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
    it('set default angle when angle is not provided', () => {
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
    it('replace current color with gradient', () => {
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
    it('set background image', () => {
        const slide = createDefaultSlide('slide1')

        const result = setSlideBackgroundImage(slide, 'image.jpg')

        expect(result.background).toEqual({
            type: 'image',
            url: 'image.jpg'
        })
    })
    it('replace current background with image', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithColor = setSlideBackgroundColor(slide, 'red')

        const result = setSlideBackgroundImage(
            slideWithColor,
            'image.jpg'
        )

        expect(result.background).toEqual({
            type: 'image',
            url: 'image.jpg'
        })
    })
    it('add new background what is not image', () => {
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
    it('clear background color', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithColor = setSlideBackgroundColor(slide, 'red')

        const result = clearSlideBackground(slideWithColor)

        expect(result).toEqual(slide)
    })
    it('clear background image', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithImage = setSlideBackgroundImage(slide, 'image.png')

        const result = clearSlideBackground(slideWithImage)

        expect(result).toEqual(slide)
    })
    it('clear background gradient', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithGradient = setSlideBackgroundGradient(slide, ['red', 'green', 'blue'])

        const result = clearSlideBackground(slideWithGradient)

        expect(result).toEqual(slide)
    })
    it('clear empty slide', () => {
        const slide = createDefaultSlide('slide1')

        const result = clearSlideBackground(slide)

        expect(result).toEqual(slide)
    })
    it('does not mutate the original slide', () => {

        const slide = createDefaultSlide('slide1')

        clearSlideBackground(slide)

        expect(slide.background).toEqual({
            type: 'none'
        })
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
    it('add text object to slide', () => {
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
    it('add next text object with next layer', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithFirstObject = addTextObject(slide, 'Hello World!', 10, 20, 50, 100, 'Arial', 14, 'black', 'text1')

        const result = addTextObject(slideWithFirstObject, 'And you :)', 10, 20, 50, 100, 'Arial', 14, 'black', 'text2')

        expect(result.elements).toHaveLength(2)
        expect(result.elements[1].id).toBe('text2')
        expect(result.elements[1].layer).toBe(1)
        expect(result.elements[0].layer).toBe(0)
    })
    it('add text object with empty text and zero position', () => {
        const slide = createDefaultSlide('slide1')
        
        const result = addTextObject(slide, '', 0, 0, 0, 0, 'Arial', 1, 'black', 'text1')
        const element = result.elements[0]
        if (element.type !== 'text') {
            throw new Error('Expected text object')
        }

        expect(element.content).toBe('')
        expect(element.position).toEqual({
            x: 0,
            y: 0
        })
        expect(element.width).toBe(0)
        expect(element.height).toBe(0)
        expect(element.style.fontSize).toBe(1)
    })
    it('does not mutate the in coming slide', () => {
        const slide = createDefaultSlide('slide1')
        const result = addTextObject(slide, 'Hello', 10, 20, 50, 100, 'Arial', 14, 'black', 'text1')

        expect(slide.elements).toHaveLength(0)
        expect(result.elements).toHaveLength(1)

    })
})

describe('addImageObject', () => {
    it('add image object to slide', () => {
        const slide = createDefaultSlide('slide1')
        
        const result = addImageObject(slide, 'image.img', 10, 20, 50, 100, 'image1')

        expect(result.elements).toHaveLength(1)
    })
    it('add next image object with next layer', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithFirstObject = addImageObject(slide, 'image.png', 10, 20, 50, 100, 'image1')
        
        const result = addImageObject(slideWithFirstObject, 'picture.img', 10, 400, 20, 10, 'image2')

        expect(result.elements).toHaveLength(2)
        expect(result.elements[0].layer).toBe(0)
        expect(result.elements[1].layer).toBe(1)
        expect(result.elements[1].id).toBe('image2')
    })
    it('do not add object when url has no format', () => {
        const slide = createDefaultSlide('slide1')
        
        const result = addImageObject(slide, 'image', 19, 30, 21, 14, 'image1')

        expect(result).toEqual(slide)
    })
    it('add image object with zero position and size', () => {
        const slide = createDefaultSlide('slide1')
        
        const result = addImageObject(slide, 'image.jpg', 0, 0, 0, 0, 'image1')
        const element = result.elements[0]
        if (element.type !== 'image') {
            throw new Error('invalid format')
        }
        
        expect(element.position).toEqual({
            x: 0,
            y: 0
        })
        expect(element.width).toBe(0)
        expect(element.height).toBe(0)
    })
    it('does not mutated incoming slide', () => {
        const slide = createDefaultSlide('slide1')

        const result = addImageObject(slide, 'image.jpg', 10, 20, 100, 50, 'image1')

        expect(slide.elements).toHaveLength(0)
        expect(result.elements).toHaveLength(1)
    })
})

describe('removeObject', () => {
    it('remove only object from slide', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addTextObject(slide, 'Hello', 10, 20, 100, 50, 'Arial', 20, 'black', 'text1')

        const result = removeObject(
            slideWithObject,
            'text1'
        )

        expect(result.elements).toHaveLength(0)
    })
    it('remove first object from slide', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithFirstObject = addTextObject(slide, 'First', 10, 20, 100, 50, 'Arial', 20, 'black', 'text1')
        const slideWithTwoObjects = addTextObject(slideWithFirstObject, 'Second', 20, 30, 100, 50, 'Arial', 20, 'black', 'text2')

        const result = removeObject(slideWithTwoObjects, 'text1')

        expect(result.elements).toHaveLength(1)
        expect(result.elements[0].id).toBe('text2')
    })
    it('remove middle object from slide', () => {
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
    it('remove last object from slide', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithFirstObject = addTextObject(slide, 'First', 10, 20, 30, 40, 'Arial', 14, 'black', 'object1')
        const slideWithSecondObject = addTextObject(slideWithFirstObject, 'Second', 10, 20, 30, 40, 'Arial', 20, 'blue', 'object2')
        
        const result = removeObject(slideWithSecondObject, 'object2')

        expect(result.elements).toHaveLength(1)
        expect(result.elements[0].id).toBe('object1')
    })
    it('return slide if object does not exist', () => {
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

describe('resizeObject', () => {
    it('resize text object', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addTextObject(slide, 'Hello', 10, 20, 30, 40, 'Arial', 14, 'blue', 'text1')

        const result = resizeObject(slideWithObject, 'text1', 50, 90)
        const element = result.elements[0]
        if (element.type !== 'text') {
            throw new Error('Expected text object')
        }

        expect(element.width).toBe(50)
        expect(element.height).toBe(90)
    })
    it('resize image object', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addImageObject(slide, 'hello.img', 10, 20, 30, 40, 'image1')

        const result = resizeObject(slideWithObject, 'image1', 50, 90)
        const element = result.elements[0]
        if (element.type !== 'image') {
            throw new Error('Expected image object')
        }

        expect(element.width).toBe(50)
        expect(element.height).toBe(90)
    })
    it('resize circle by radius', () => {
        const slide = createDefaultSlide('slide1')
        const circle = {
            id: 'circle1',
            position: {
                x: 10,
                y: 20
            },
            type: 'figure' as const,
            layer: 0,
            typeFigure: 'circle' as const,
            borderColor: 'black',
            radius: 50,
            fillColor: 'red'
        }
        const slideWithCircle: Slide = {
            ...slide,
            elements: [circle]
        }

        const result = resizeObject(slideWithCircle, 'circle1', 100, 100)
        const element = result.elements[0]
        if (element.type !== 'figure' || element.typeFigure !== 'circle') {
            throw new Error('Expected circle')
        }

        expect(element.radius).toBe(50)
    })
    it('resize rectangle', () => {
        const slide = createDefaultSlide('slide1')
        const rectangle: SlideObject = {
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
        const slideWithRectangle: Slide = {
            ...slide,
            elements: [rectangle]
        }

        const result = resizeObject(
            slideWithRectangle,
            'rectangle1',
            100,
            80
        )
        const element = result.elements[0]
        if (element.type !== 'figure' || element.typeFigure !== 'rectangle') {
            throw new Error('Expected rectangle')
        }

        expect(element.width).toBe(100)
        expect(element.height).toBe(80)
    })
    it('resize triangle', () => {
        const slide = createDefaultSlide('slide1')
        const rectangle: SlideObject = {
            id: 'triangle1',
            points: [{x: 10, y: 10}, {x:15, y:15}, {x:18, y:0}],
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
        const slideWithRectangle: Slide = {
            ...slide,
            elements: [rectangle]
        }

        const result = resizeObject(
            slideWithRectangle,
            'triangle1',
            100,
            80
        )
        const element = result.elements[0]
        if (element.type !== 'figure' || element.typeFigure !== 'triangle') {
            throw new Error('Expected rectangle')
        }

        expect(element.width).toBe(100)
        expect(element.height).toBe(80)
    })
    it('return slide if object does not exist', () => {
        const slide = createDefaultSlide('slide1')

        const result = resizeObject(slide, 'unknow', 100, 10)

        expect(result).toEqual(slide)
    })
    it('does not mutate the original data', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addTextObject(slide, 'Hello', 10, 20, 30, 40, 'Arial', 14, 'blue', 'text1')
        resizeObject(slideWithObject, 'text1', 50, 90)

        const element = slideWithObject.elements[0]
        if (element.type !== 'text') {
            throw Error('Expacted text object')
        }
        
        expect(element.width).toBe(30)
        expect(element.height).toBe(40)
    })
})
describe('moveObject', () => {
    it('move object to another position', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addTextObject(slide, 'Hello', 10, 20, 100, 50, 'Arial', 14, 'black', 'text1')

        const result = moveObject(slideWithObject, 'text1', 50, 100)
        const element = result.elements[0]
        if (element.type !== 'text') {
            throw new Error('Expected text object')
        }

        expect(element.position).toEqual({
            x: 50,
            y: 100
        })
    })
    it('move object to zero position', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addTextObject(slide, 'Hello', 10, 20, 100, 50, 'Arial', 14, 'black', 'text1')

        const result = moveObject(slideWithObject, 'text1', 0, 0)
        const element = result.elements[0]
        if (element.type !== 'text') {
            throw new Error('Expected text object')
        }

        expect(element.position).toEqual({
            x: 0,
            y: 0
        })
    })
    it('move object to negative position', () => {
        const slide = createDefaultSlide('slide1')
        const slideWithObject = addTextObject(slide, 'Hello', 10, 20, 100, 50, 'Arial', 14, 'black', 'text1')

        const result = moveObject(
            slideWithObject,
            'text1',
            -50,
            -100
        )
        const element = result.elements[0]
        if (element.type !== 'text') {
            throw new Error('Expected text object')
        }

        expect(element.position).toEqual({
            x: -50,
            y: -100
        })
    })
    it('return slide if object does not exist', () => {
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
        moveObject(slideWithObject, 'text1', 50, 100)
        const element = slideWithObject.elements[0]
        if (element.type !== 'text') {
            throw new Error('Expected text object')
        }

        expect(element.position).toEqual({
            x: 10,
            y: 20
        })
    })
})

describe('updateTextObjectStyles', () => {
    it('update text object style', () => {
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
    it('update all text style values', () => {
        const slide = createDefaultSlide('slide1');
        const slideWithText = addTextObject(slide, 'Hello', 10, 20, 100, 50, 'Arial', 14, 'black', 'text1');

        const result = updateTextObjectStyle(slideWithText, 'text1', 'Verdana', 30, 'blue');
        const element = result.elements[0];
        if (element.type !== 'text') {
            throw new Error('Expected text object');
        }

        expect(element.style).toEqual({
            fontFamily: 'Verdana',
            fontSize: 30,
            fontColor: 'blue',
            bold: false,
            italic: false,
            underline: false,
            fillColor: 'transparent',
            textAlign: 'left'
        });
    });
    it('do not update non-text object', () => {
        const slide = createDefaultSlide('slide1');
        const slideWithImage = addImageObject(slide, 'image.jpg', 10, 20, 100, 50, 'image1');

        const result = updateTextObjectStyle(slideWithImage, 'image1', 'Arial', 20, 'red');

        expect(result).toEqual(slideWithImage);
    })
    it('return slide if object does not exist', () => {
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