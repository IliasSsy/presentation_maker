import { SlidePreview } from "../slidePreview/SlidePreview.js";
import type { Slide } from "../../../../types/slide.js";
import styles from "./slideList.module.css"; 

type SlideThumbnailProps = {
    slide: Slide;
    index: number;
    isActive: boolean;
    canDelete: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

// Миниатюра
function SlideThumbnail({ slide, index, isActive, canDelete, onSelect, onDelete }: SlideThumbnailProps) {
    return (
        <div
            className={`${styles.thumbnailWrapper} ${isActive ? styles.active : ""}`}
            onClick={() => onSelect(slide.id)}
        >
            <span className={styles.slideNumber}>{index + 1}</span>
            <div className={styles.previewContainer}>
                <div className={styles.scaledWrapper}>
                    <SlidePreview slide={slide} />
                </div>
            </div>
            {canDelete && (
                <button
                    className={styles.deleteButton}
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete(slide.id);
                    }}
                    title="Удалить слайд"
                >
                    ×
                </button>
            )}
        </div>
    );
}

export { SlideThumbnail };