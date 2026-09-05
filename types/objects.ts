type Objects = {
    id: string,
    position: Point,
    type: 'figure' | 'image' | 'text',
    layer: number,
}

type TextObject = Objects & {
    type: 'text',
    width: number,
    height: number,
    content: string,
    style: TextStyle,
}

type Figure = Objects & {
    type: 'figure',
    typeFigure: 'circle' | 'rectangle' | 'triangle',
    borderColor: string,
}

type ImageObject = Objects & {
    type: 'image',
    url: string,
    width: number,
    height: number,
}

type Point = {
    x: number,
    y: number,
}

type TextStyle = {
    fontFamily: string,
    fontSize: number,
    fontColor: string,
    bold: boolean,
    italic: boolean,
    underline: boolean,
    fillColor: string,
    textAlign: 'left' | 'center' | 'right',
}

type Circle = Figure & {
    typeFigure: 'circle',
    radius: number,
    fillColor: string,
}

type Rectangle = Figure & {
    typeFigure: 'rectangle',
    width: number,
    height: number,
    fillColor: string,
}

type Triangle = Figure & {
    typeFigure: 'triangle',
    points: [Point, Point, Point],
    width: number,
    height: number,
    fillColor: string,
}

type SlideObject = TextObject | ImageObject | Circle | Rectangle | Triangle;

export {
    type SlideObject,
}