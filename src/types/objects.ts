type Objects = {
    id: string,
    position: Point,
    type: 'figure' | 'image' | 'text',
    layer: number,
}

type InlineStyle = {
    fontFamily: string,
    fontSize: number,
    fontColor: string,
    bold: boolean,
    italic: boolean,
    underline: boolean,
}

type TextChunk = {
    text: string,
    style: InlineStyle,
}

type BlockStyle = {
    fillColor: string,
    textAlign: 'left' | 'center' | 'right',
}

type TextObject = Objects & {
    type: 'text',
    size: Size,
    content: TextChunk[],
    style: BlockStyle,    
}

type Size = {
    width: number,
    height: number,
}

type Figure = Objects & {
    type: 'figure',
    typeFigure: 'circle' | 'rectangle' | 'triangle',
    borderColor: string,
}

type ImageObject = Objects &  {
    type: 'image',
    size: Size,
    url: string,
}

type Point = {
    x: number,
    y: number,
}

type Circle = Figure & {
    typeFigure: 'circle',
    radius: number,
    fillColor: string,
}

type Rectangle = Figure  & {
    typeFigure: 'rectangle',
    size: Size,
    fillColor: string,
}

type Triangle = Figure & {
    typeFigure: 'triangle',
    size: Size,
    points: [Point, Point, Point],
    fillColor: string,
}

type SlideObject = TextObject | ImageObject | Circle | Rectangle | Triangle;

export {
    type SlideObject,
    type BlockStyle,    
    type InlineStyle,   
    type TextChunk,     
    type TextObject,
    type ImageObject,
    type Size,
    type Point,
}