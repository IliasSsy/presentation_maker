import { ToolbarButton } from "../Button/button";
import { ScaleInputField } from "../Scale/scaleInput";
import { LanguageSelector } from "../LanguageSelector/languageSelector";
import type { Presentation } from "../../../../../types/presentation";
import { translate } from "../../../services/languageChoose/i18n";
import { dispatch } from "../../../modules/editor";
import { changePresentationTitle } from "../../../modules/modifiers";

import arrowIcon from "./icons/arrow.svg"
import prevIcon from "./icons/undo.svg"
import scaleIcon from "./icons/scale.svg"
import nextIcon from "./icons/rendo.svg"
import printerIcon from "./icons/printer.svg"
import textIcon from "./icons/text_button.svg"
import shapeIcon from "./icons/shape_icon.svg"
import cursorIcon from "./icons/cursor.svg"

import styles from "./toolbar.module.css";

interface ToolbarProps {
    presentation: Presentation;
}

function Toolbar({ presentation }: ToolbarProps) {
    return (
        <div className={styles.toolbar}>
            <div className={styles.group}>
                <ToolbarButton tooltipKey="presentationName" onClick={() => {}}>
                    <input 
                        type="text"
                        value={presentation.name}
                        onChange={(e) => {
                            dispatch(changePresentationTitle, e.target.value);
                        }}
                        className={styles.titleInput}
                    />
                </ToolbarButton>
            </div>
            <div className={styles.divider} />

            <div className={styles.group}>
                <ToolbarButton tooltipKey="addSlide" onClick={() => {}}>
                    +
                </ToolbarButton>
                <ToolbarButton tooltipKey="selectLayout" onClick={() => {}}>
                    <img src={arrowIcon} alt="layout" className={styles.img} />
                </ToolbarButton>
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
                <ToolbarButton tooltipKey="undoItem" onClick={() => {}}>
                    <img src={prevIcon} alt="undo" className={styles.img} />
                </ToolbarButton>
                <ToolbarButton tooltipKey="redoItem" onClick={() => {}}>
                    <img src={nextIcon} alt="redo" className={styles.img} />
                </ToolbarButton>
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
                <ToolbarButton tooltipKey="printItem" onClick={() => {}}>
                    <img src={printerIcon} alt="print" className={styles.img} />
                </ToolbarButton>
                <ToolbarButton tooltipKey="textButton" onClick={() => {}}>
                    <img src={textIcon} alt="text" className={styles.img} />
                </ToolbarButton>
                <ToolbarButton tooltipKey="shapesButton" onClick={() => {}}>
                    <img src={shapeIcon} alt="shape" className={styles.img} />
                </ToolbarButton>
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
                <ToolbarButton tooltipKey="scaleField" onClick={() => {}}>
                    <img src={scaleIcon} alt="scale" className={styles.img} />
                </ToolbarButton>
                <ScaleInputField />
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
                <ToolbarButton tooltipKey="cursorButton" onClick={() => {}}>
                    <img src={cursorIcon} alt="cursor" className={styles.img} />
                </ToolbarButton>
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
                <ToolbarButton tooltipKey="Background" onClick={() => {}}>
                    Фон
                </ToolbarButton>
            </div>

            <div className={`${styles.group} ${styles.pushRight}`}>
                <LanguageSelector />
            </div>
            <div className={styles.group}>
                <ToolbarButton tooltipKey="slideShow" onClick={() => {}}>
                    {translate("slideShow")}
                </ToolbarButton>
            </div>
        </div>
    );
}

export { Toolbar };