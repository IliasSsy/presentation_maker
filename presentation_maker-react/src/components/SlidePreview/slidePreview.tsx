import type { Slide } from "../../../../types/slide";
import { SlideObjectComp } from "../slideObject/SlideObject";
import styles from "./slidePreview.module.css";
import { getBackgroundStyle } from "../../modules/editor";

type SlidePreviewProps = {
    slide: Slide;
    selectedIds: string[];
    onObjectClick: (e: React.MouseEvent, objectId: string) => void;
    onBackgroundClick?: (e: React.MouseEvent) => void; 
}

function SlidePreview({slide, selectedIds = [], onObjectClick, onBackgroundClick}: SlidePreviewProps) {
    return (
        <div 
            className={styles.slide} 
            style={getBackgroundStyle(slide.background)}
            onClick={onBackgroundClick} 
        >
            {slide.elements.map((element) => (
                <SlideObjectComp 
                    key={element.id} 
                    object={element} 
                    isSelected={selectedIds.includes(element.id)}
                    onClick={(event) => onObjectClick && onObjectClick(event, element.id)}
                />
            ))}
        </div>
    );
}

export { SlidePreview };