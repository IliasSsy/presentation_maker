import type { Slide } from "../../../../types/slide.js";
import { SlidePreview } from "../slidePreview/SlidePreview.js";
import { useSelection } from "./hooks/useSelection.js";
import styles from "./WorkSpace.module.css";

type WorkspaceProps = {
    activeSlide: Slide;
}

function Workspace({ activeSlide }: WorkspaceProps) {
    const { activeObjectIds, handleObjectClick, handleBackgroundClick } = useSelection();
    return (
        <div className={styles.workspaceContainer}>
            <div 
                className={styles.canvasArea} 
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        handleBackgroundClick();
                    }
                }}
            >
                <div 
                    className={styles.canvasWrapper}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleBackgroundClick();
                        }
                    }}
                >
                    <SlidePreview 
                        slide={activeSlide} 
                        selectedIds={activeObjectIds}
                        onObjectClick={handleObjectClick}
                        onBackgroundClick={handleBackgroundClick}
                    />
                </div>
            </div>
            <div className={styles.speakerNotesContainer}>
                <textarea className={styles.speakerNotesInput} placeholder="Нажмите, чтобы ввести заметки" rows={2} />
            </div>
        </div>
    );
}

export { Workspace };