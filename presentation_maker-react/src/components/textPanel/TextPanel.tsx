import { useRef } from "react";
import { Button } from "../common/button/Button.js";
import { DropList } from "../common/dropList/DropList.js";
import { dispatch } from "../../modules/editor.js";
import { updateTextModifier } from "../../modules/modifiers.js";
import type { TextObject } from "../../../../types/objects.js";
import { FONT_OPTIONS, SIZE_OPTIONS, toHexColor, applyTextStyle, type FontSize } from "./utils/textPanelUtils.js";
import alignLeftIcon from "./icons/align_left.svg";
import alignCenterIcon from "./icons/align_center.svg";
import alignRightIcon from "./icons/align_right.svg";
import styles from "./textPanel.module.css";

type TextPanelProps = {
    selectedTextObject: TextObject;
    placement?: "top" | "bottom";
};

function TextPanel({ selectedTextObject, placement = "bottom" }: TextPanelProps) {
    const currentStyle = selectedTextObject.content[0]?.style || {
        fontFamily: "Arial",
        fontSize: 16,
        fontColor: "#000000",
    };
    const savedRange = useRef<Range | null>(null);
    const saveSelection = () => {
        const selection = window.getSelection();
        const editor = document.querySelector('[contenteditable="true"]');
        if (!selection?.rangeCount || !editor) return;
        const range = selection.getRangeAt(0);
        if (editor.contains(range.startContainer) && editor.contains(range.endContainer)) {
            savedRange.current = range.cloneRange();
        }
    };
    const handleSizeChange = (size: FontSize) => {
        applyTextStyle(selectedTextObject, savedRange, "fontSize", { fontSize: Number(size) }, "7", (editor) => {
            editor.querySelectorAll<HTMLElement>("span, font").forEach(element => {
                if (element.getAttribute("size") === "7" || element.style.fontSize.includes("xxx-large")) {
                    element.removeAttribute("size");
                    element.style.fontSize = `${size}px`;
                }
            });
        });
    };
    const handleFormat = (event: React.MouseEvent, cmd: "bold" | "italic" | "underline") => {
        event.preventDefault();
        saveSelection();
        applyTextStyle(selectedTextObject, savedRange, cmd, { [cmd]: !currentStyle[cmd] });
    };
    const handleAlign = (event: React.MouseEvent, textAlign: "left" | "center" | "right") => {
        event.preventDefault();
        dispatch(updateTextModifier, {
            ...selectedTextObject,
            style: { ...selectedTextObject.style, textAlign },
        });
    };
    const placementClass = placement === "top" ? styles.placementTop : styles.placementBottom;
    return (
        <div
            data-panel="text-panel"
            className={`${styles.textPanel} ${placementClass}`}
            onMouseDown={(event) => {
                saveSelection();
                if (!(event.target as HTMLElement).closest("select, input, option")) {
                    event.preventDefault();
                }
            }}
        >
            <div className={styles.group}>
                <DropList
                    defaultValue={currentStyle.fontFamily}
                    onChange={(font) => applyTextStyle(selectedTextObject, savedRange, "fontName", { fontFamily: font }, font)}
                    options={FONT_OPTIONS}
                />
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
                <DropList
                    defaultValue={String(currentStyle.fontSize)}
                    onChange={handleSizeChange}
                    options={SIZE_OPTIONS}
                />
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
                <div onMouseDown={(e) => handleFormat(e, "bold")}>
                    <Button tooltipKey="bold" onClick={() => {}}>
                        <span style={{ fontWeight: 700, fontSize: "15px" }}>B</span>
                    </Button>
                </div>
                <div onMouseDown={(e) => handleFormat(e, "italic")}>
                    <Button tooltipKey="italic" onClick={() => {}}>
                        <span style={{ fontStyle: "italic", fontWeight: 600, fontSize: "15px", fontFamily: "Georgia, serif" }}>I</span>
                    </Button>
                </div>
                <div onMouseDown={(e) => handleFormat(e, "underline")}>
                    <Button tooltipKey="underline" onClick={() => {}}>
                        <span style={{ textDecoration: "underline", fontWeight: 600, fontSize: "15px" }}>U</span>
                    </Button>
                </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
                <input
                    type="color"
                    value={toHexColor(currentStyle.fontColor)}
                    onMouseDown={saveSelection}
                    onChange={(e) => applyTextStyle(selectedTextObject, savedRange, "foreColor", { fontColor: e.target.value }, e.target.value)}
                    className={styles.colorPicker}
                    title="Цвет текста"
                />
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
                <div onMouseDown={(e) => handleAlign(e, "left")}>
                    <Button tooltipKey="alignLeft" onClick={() => {}}>
                        <img src={alignLeftIcon} alt="alignLeft" className={styles.img} />
                    </Button>
                </div>
                <div onMouseDown={(e) => handleAlign(e, "center")}>
                    <Button tooltipKey="alignCenter" onClick={() => {}}>
                        <img src={alignCenterIcon} alt="alignCenter" className={styles.img} />
                    </Button>
                </div>
                <div onMouseDown={(e) => handleAlign(e, "right")}>
                    <Button tooltipKey="alignRight" onClick={() => {}}>
                        <img src={alignRightIcon} alt="alignRight" className={styles.img} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export { TextPanel };