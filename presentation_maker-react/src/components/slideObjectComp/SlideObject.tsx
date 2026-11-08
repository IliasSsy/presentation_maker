import type { SlideObject, Point } from "../../../../types/objects";
import { TextObjectComp } from "./textObjectComp/TextObjectComp";
import React from "react";

type SlideObjectProps = {
    object: SlideObject;
    position: Point;
    onClick?: (e: React.MouseEvent) => void;
    onMouseDown?: (e: React.MouseEvent) => void;
    onDoubleClick?: (e: React.MouseEvent) => void;
};

function SlideObjectComp({object, position, onClick, onMouseDown, onDoubleClick}: SlideObjectProps) {

    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: object.layer,
        cursor: onMouseDown ? 'pointer' : 'default',
        userSelect: 'none',
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement;
        if (target.closest('[id^="text-editor-"]')) {
            return;
        }
        onMouseDown?.(e);
    };

    if (object.type === 'text') {
        const { size, style } = object;

        return (
            <div
                id={object.id}
                draggable={false}
                onClick={onClick}
                onMouseDown={handleMouseDown}
                onDoubleClick={onDoubleClick}
                style={{
                    ...baseStyle,
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                    backgroundColor: style.fillColor,
                    overflow: 'visible',
                    zIndex: 6,
                }}
            >
                <TextObjectComp element={object} />
            </div>
        );
    }

    if (object.type === 'image') {
        const { size, url } = object;

        return (
            <div
                id={object.id}
                draggable={false}
                onClick={onClick}
                onMouseDown={handleMouseDown}
                style={{
                    ...baseStyle,
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                }}
            >
                <img
                    src={url}
                    alt="slide object"
                    draggable={false}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
        );
    }

    if (object.type === 'figure') {
        if (object.typeFigure === 'rectangle') {
            const { size, fillColor, borderColor } = object;
            return (
                <div
                    id={object.id}
                    draggable={false}
                    onClick={onClick}
                    onMouseDown={handleMouseDown}
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
            return (
                <div
                    id={object.id}
                    draggable={false}
                    onClick={onClick}
                    onMouseDown={handleMouseDown}
                    style={{
                        ...baseStyle,
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`,
                        backgroundColor: fillColor,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '50%',
                    }}
                />
            );
        }

        if (object.typeFigure === 'triangle') {
            const { size, fillColor, borderColor, points } = object;
            const pointsString = points
                .map(p => `${p.x},${p.y}`)
                .join(' ');
            return (
                <div
                    id={object.id}
                    draggable={false}
                    onClick={onClick}
                    onMouseDown={handleMouseDown}
                    style={{
                        ...baseStyle,
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                    }}
                >
                    <svg
                        style={{
                            width: '100%',
                            height: '100%',
                            overflow: 'visible'
                        }}
                    >
                        <polygon
                            points={pointsString}
                            fill={fillColor}
                            stroke={borderColor}
                            strokeWidth="1"
                        />
                    </svg>
                </div>
            );
        }
    }

    return null;
}

export { SlideObjectComp };