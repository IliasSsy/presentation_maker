import type { Slide } from "../../../../types/slide";
import { SlidePreview } from "../SlidePreview/slidePreview";
import styles from "./workspace.module.css";

interface WorkspaceProps {
    activeSlide: Slide;
}

function Workspace({ activeSlide }: WorkspaceProps) {
    return (
        <div className={styles.workspaceContainer}>
            <div className={styles.canvasArea}>
                <div className={styles.canvasWrapper}>
                    <SlidePreview slide={activeSlide} />
                </div>
            </div>

            <div className={styles.speakerNotesContainer}>
                <textarea
                    className={styles.speakerNotesInput}
                    placeholder="Нажмите, чтобы ввести заметки"
                    rows={2}
                />
            </div>
        </div>
    );
}

export { Workspace };