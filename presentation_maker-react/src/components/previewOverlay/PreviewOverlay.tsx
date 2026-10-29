import { SlidePreview } from "../slidePreview/SlidePreview";
import type { Presentation } from "../../../../types/presentation";
import { getBackgroundStyle } from "../../modules/editor";
import { getState, dispatch } from "../../modules/editor";
import { nextSlideModifier, prevSlideModifier } from "../../modules/modifiers";
import styles from "./PreviewOverlay.module.css";

type PreviewModProps = {
    presentation: Presentation;
    onClose: () => void;
}

function PreviewOverlay({ presentation, onClose }: PreviewModProps) {
    const state = getState();
    if (state == null) {
        return null;
    }
    const slides = presentation.slides;
    const currentIndex = slides.findIndex(slide => slide.id === state.activeSlideId);
    const currentSlide = slides[currentIndex] || slides[0];
    return (
        <div className={styles.overlay}>
            <button className={styles.closeButton} onClick={onClose}>
                x
            </button>
            <button 
                className={styles.prevButton} 
                onClick={() => dispatch(prevSlideModifier)}
            >
            </button>
            <div className={styles.slideContainer}>
                <div 
                    className={styles.slideWrapper} 
                    style={getBackgroundStyle(currentSlide.background)}
                >
                    <SlidePreview slide={currentSlide} />
                </div>
            </div>
            <button 
                className={styles.nextButton} 
                onClick={() => dispatch(nextSlideModifier)}
            >
            </button>
        </div>
    );
}

export { PreviewOverlay };