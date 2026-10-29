import type { Presentation } from "../../../../types/presentation";
import { SlideThumbnail } from "./SlideThumbnail";
import styles from "./slideList.module.css";

type SlideListProps = {
    presentation: Presentation;
    activeSlideId: string;
    onSelectSlide: (id: string) => void;
    onAddSlide: () => void;
    onDeleteSlide: (id: string) => void;
}

function SlideList({ presentation, activeSlideId, onSelectSlide, onAddSlide, onDeleteSlide }: SlideListProps) {
    const canDelete = presentation.slides.length > 1;

    return (
        <div className={styles.slideListContainer}>
            <div className={styles.listHeader}>
                <span>Слайды</span>
                <button className={styles.addButton} onClick={onAddSlide}>
                    + Добавить
                </button>
            </div>
            <div className={styles.slidesContainer}>
                {presentation.slides.map((slide, index) => (
                    <SlideThumbnail
                        key={slide.id || index}
                        slide={slide}
                        index={index}
                        isActive={slide.id === activeSlideId}
                        canDelete={canDelete}
                        onSelect={onSelectSlide}
                        onDelete={onDeleteSlide}
                    />
                ))}
            </div>
        </div>
    );
}

export { SlideList };