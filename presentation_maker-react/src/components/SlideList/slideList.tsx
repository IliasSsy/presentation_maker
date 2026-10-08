import type { Presentation } from "../../../../types/presentation";
import { SlidePreview } from "../SlidePreview/slidePreview";
import styles from "./slideList.module.css";

interface SlideListProps {
    presentation: Presentation;
    activeSlideId: string;
    onSelectSlide: (id: string) => void;
    onAddSlide: () => void;
    onDeleteSlide: (id: string) => void;
}

function SlideList({ presentation, activeSlideId, onSelectSlide, onAddSlide, onDeleteSlide }: SlideListProps) {
    return (
        <div className={styles.slideListContainer}>

            <div className={styles.listHeader}>
                <span>Слайды</span>
                <button className={styles.addButton} onClick={onAddSlide}>
                    + Добавить
                </button>
            </div>
            <div className={styles.slidesContainer}>
                {presentation.slides.map((slide, index) => {
                    const isActive = slide.id === activeSlideId;

                    return (
                        <div
                            key={slide.id}
                            className={`${styles.thumbnailWrapper} ${isActive ? styles.active : ""}`}
                            onClick={() => onSelectSlide(slide.id)}
                        >
                            <span className={styles.slideNumber}>{index + 1}</span>

                            <div className={styles.previewContainer}>
                                <div className={styles.scaledWrapper}>
                                    <SlidePreview slide={slide} />
                                </div>
                            </div>
                            {presentation.slides.length > 1 && (
                                <button
                                    className={styles.deleteButton}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onDeleteSlide(slide.id);
                                    }}
                                    title="Удалить слайд"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export { SlideList };