import type { SlideObject } from "../../../../types/objects";

interface SlideObjectProps {
    object: SlideObject;
}

function SlideObjectComp({ object }: SlideObjectProps) {
    const baseStyle = {
        position: 'absolute' as const,
        left: `${object.position.x}px`,
        top: `${object.position.y}px`,
        zIndex: object.layer,
    };
    if (object.type === 'text') {
        const { size, content, style } = object;
        return (
            <div
                style={{
                    ...baseStyle,
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                    fontFamily: style.fontFamily,
                    fontSize: `${style.fontSize}px`,
                    color: style.fontColor,
                    backgroundColor: style.fillColor,
                    fontWeight: style.bold ? 'bold' : 'normal',
                    fontStyle: style.italic ? 'italic' : 'normal',
                    textDecoration: style.underline ? 'underline' : 'none',
                    textAlign: style.textAlign,
                    overflow: 'hidden',
                    whiteSpace: 'pre-wrap',
                }}
            >
                {content}
            </div>
        );
    }
    if (object.type === 'image') {
        const { size, url } = object;
        return (
            <div
                style={{
                    ...baseStyle,
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                }}
            >
                <img
                    src={url}
                    alt="slide object"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
        );
    }

    if (object.type === 'figure') {
        if (object.typeFigure === 'rectangle') {
            const { size, fillColor, borderColor } = object;
            return (
                <div
                    style={{
                        ...baseStyle,
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                        backgroundColor: fillColor,
                        border: `1px solid ${borderColor}`,
                    }}
                />
            );
        }
        if (object.typeFigure === 'circle') {
            const { radius, fillColor, borderColor } = object;
            const diameter = radius * 2;
            return (
                <div
                    style={{
                        ...baseStyle,
                        width: `${diameter}px`,
                        height: `${diameter}px`,
                        backgroundColor: fillColor,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '50%',
                    }}
                />
            );
        }
        if (object.typeFigure === 'triangle') {
            const { size, fillColor, borderColor, points } = object;
            const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
            return (
                <svg
                    style={{
                        ...baseStyle,
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                        overflow: 'visible',
                    }}
                >
                    <polygon
                        points={pointsString}
                        fill={fillColor}
                        stroke={borderColor}
                        strokeWidth="1"
                    />
                </svg>
            );
        }
    }

    return null;
}

export { SlideObjectComp };