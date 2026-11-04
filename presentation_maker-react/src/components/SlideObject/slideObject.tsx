import type { SlideObject, Point } from "../../../../types/objects";
import React from "react";

type SlideObjectProps = {
    object: SlideObject;
    position: Point; 
    isSelected?: boolean; 
    onClick?: (e: React.MouseEvent) => void; 
    onMouseDown?: (e: React.MouseEvent) => void; 
}

function SlideObjectComp({ object, position, isSelected, onClick, onMouseDown }: SlideObjectProps) {
    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: object.layer,
        outline: isSelected ? '1px solid #0b99ff' : 'none',
        cursor: onMouseDown ? (isSelected ? 'grab' : 'pointer') : 'default',
        userSelect: 'none', 
    };

    const renderSelectionMarkers = () => {
    if (!isSelected) return null;

    const markerBase: React.CSSProperties = {
        position: 'absolute',
        width: '8px',
        height: '8px',
        backgroundColor: '#ffffff',
        border: '1px solid #0b99ff',
        boxSizing: 'border-box',
        zIndex: 10,
    };

    const markers = [
        { id: 'tl', style: { top: '0%', left: '0%', transform: 'translate(-50%, -50%)', cursor: 'nwse-resize', } },
        { id: 'tc', style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'ns-resize', width: '15px', borderRadius: '2px' } },
        { id: 'tr', style: { top: '0%', left: '100%', transform: 'translate(-50%, -50%)', cursor: 'nesw-resize', borderRadius: '2px' } },
        { id: 'ml', style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)', cursor: 'ew-resize', height: '15px', borderRadius: '2px'  } },
        { id: 'mr', style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)', cursor: 'ew-resize', height: '15px', borderRadius: '2px' } },
        { id: 'bl', style: { top: '100%', left: '0%', transform: 'translate(-50%, -50%)', cursor: 'nesw-resize' } },
        { id: 'bc', style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'ns-resize', width: '15px', borderRadius: '2px' } },
        { id: 'br', style: { top: '100%', left: '100%', transform: 'translate(-50%, -50%)', cursor: 'nwse-resize' } }, 
    ];

    return (
        <>
            {markers.map(marker => (
                <div
                    key={marker.id}
                    style={{ ...markerBase, ...marker.style }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        if (marker.id === 'br') {
                            console.log('Старт ресайза!');
                        }
                    }}
                />
            ))}
        </>
    );
};

    if (object.type === 'text') {
        const { size, content, style } = object;
        return (
            <div
                id={object.id}
                draggable={false} 
                onClick={onClick} 
                onMouseDown={onMouseDown} 
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
                    overflow: 'visible', 
                    whiteSpace: 'pre-wrap',
                }}
            >
                {content}
                {renderSelectionMarkers()}
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
                onMouseDown={onMouseDown} 
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
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {renderSelectionMarkers()}
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
                    onMouseDown={onMouseDown} 
                    style={{
                        ...baseStyle,
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                        backgroundColor: fillColor,
                        border: `1px solid ${borderColor}`,
                    }}
                >
                    {renderSelectionMarkers()}
                </div>
            );
        }
        
        if (object.typeFigure === 'circle') {
            const { radius, fillColor, borderColor } = object;
            const diameter = radius * 2;
            return (
                <div
                    id={object.id}
                    draggable={false} 
                    onClick={onClick} 
                    onMouseDown={onMouseDown} 
                    style={{
                        ...baseStyle,
                        width: `${diameter}px`,
                        height: `${diameter}px`,
                        backgroundColor: fillColor,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '50%',
                    }}
                >
                    {renderSelectionMarkers()}
                </div>
            );
        }
        
        if (object.typeFigure === 'triangle') {
            const { size, fillColor, borderColor, points } = object;
            const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
            return (
                <div
                    id={object.id}
                    draggable={false}
                    onClick={onClick} 
                    onMouseDown={onMouseDown} 
                    style={{
                        ...baseStyle,
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                    }}
                >
                    <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <polygon
                            points={pointsString}
                            fill={fillColor}
                            stroke={borderColor}
                            strokeWidth="1"
                        />
                    </svg>
                    {renderSelectionMarkers()}
                </div>
            );
        }
    }

    return null;
}

export { SlideObjectComp };