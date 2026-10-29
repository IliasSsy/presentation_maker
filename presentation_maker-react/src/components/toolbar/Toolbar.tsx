import type { Presentation } from "../../../../types/presentation.js";
import { Button } from "../common/button/Button.js";
import { DropList } from "../common/dropList/DropList.js";
import { InputField } from "../common/inputField/InputField.tsx"; 
import { LanguageSelector } from "../../services/LanguageChoose/ChooseLanguage.js";
import { translate } from "../../services/LanguageChoose/i18n.js";
import { dispatch } from "../../modules/editor.js"; 
import { ToolbarButton } from "./toolbarButton/ToolbarButton.tsx";
import { changePresentationTitle } from "../../modules/modifiers.js";
import { startPreviewModifier } from "../../modules/modifiers.js";
import type { DropListOption } from "../common/dropList/DropList.js";
import arrowIcon from "./icons/arrow.svg";
import prevIcon from "./icons/undo.svg";
import nextIcon from "./icons/rendo.svg";
import printerIcon from "./icons/printer.svg";
import textIcon from "./icons/text_button.svg";
import shapeIcon from "./icons/shape_icon.svg";
import cursorIcon from "./icons/cursor.svg";
import scaleIcon from "./icons/scale.svg";
import styles from "./toolbar.module.css";

type ToolbarProps = {
    presentation: Presentation;
}

type Scale = "50%" | "75%" | "100%" | "125%" | "150%" | "200%"

function Toolbar({ presentation }: ToolbarProps) {
    const scaleOptions: DropListOption<Scale>[] = [
        { id: "50%", name: "50%" },
        { id: "75%", name: "75%" },
        { id: "100%", name: "100%" },
        { id: "125%", name: "125%" },
        { id: "150%", name: "150%" },
        { id: "200%", name: "200%" },
    ];
    const historyTools = [
        { tooltip: "undoItem", icon: prevIcon },
        { tooltip: "redoItem", icon: nextIcon },
    ];
    const insertTools = [
        { tooltip: "printItem", icon: printerIcon },
        { tooltip: "textButton", icon: textIcon },
        { tooltip: "shapesButton", icon: shapeIcon },
    ];
    return (
        <div className={styles.toolbar}>
            <div className={styles.group}>
                <Button tooltipKey="presentationName" onClick={() => {}}>
                    <InputField 
                        value={presentation.name}
                        onChange={(value) => {
                            dispatch(changePresentationTitle, value);
                        }}
                        className={styles.titleInput}
                    />
                </Button>
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
                <Button tooltipKey="addSlide" onClick={() => {}}>
                    +
                </Button>
                <ToolbarButton tooltipKey="selectLayout" icon={arrowIcon} />
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
                {historyTools.map((tool) => (
                    <ToolbarButton key={tool.tooltip} tooltipKey={tool.tooltip} icon={tool.icon} />
                ))}
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
                {insertTools.map((tool) => (
                    <ToolbarButton key={tool.tooltip} tooltipKey={tool.tooltip} icon={tool.icon} />
                ))}
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
                <ToolbarButton tooltipKey="scaleField" icon={scaleIcon} />
                <DropList 
                    defaultValue="100%" 
                    onChange={(value) => console.log("Новый масштаб:", value)}
                    options={scaleOptions} 
                />
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
                <ToolbarButton tooltipKey="cursorButton" icon={cursorIcon} />
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
                <Button tooltipKey="Background" onClick={() => {}}>
                    Фон
                </Button>
            </div>
            <div className={`${styles.group} ${styles.pushRight}`}>
                <LanguageSelector />
            </div>
            <div className={styles.group}>
                <Button tooltipKey="slideShow" onClick={() => {
                    dispatch(startPreviewModifier); 
                }}>
                    {translate("slideShow")}
                </Button>
            </div>
        </div>
    );
}

export { Toolbar };