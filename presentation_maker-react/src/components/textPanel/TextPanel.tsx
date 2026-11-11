import { useRef } from "react";
import { Button } from "../common/button/Button.js";
import { DropList, type DropListOption } from "../common/dropList/DropList.js";
import { dispatch } from "../../modules/editor.js";
import { updateTextModifier } from "../../modules/modifiers.js";
import type { TextObject, InlineStyle } from "../../../../types/objects.js";
import alignLeftIcon from "./icons/align_left.svg";
import alignCenterIcon from "./icons/align_center.svg";
import alignRightIcon from "./icons/align_right.svg";
import styles from "./textPanel.module.css";

type TextPanelProps = {
    selectedTextObject: TextObject;
    placement?: "top" | "bottom";
};

type FontFamily = "Arial" | "Georgia" | "Times New Roman" | "Courier New";
type FontSize = "12" | "14" | "16" | "18" | "20" | "22" | "24" | "28" | "32" | "48";

const FONT_OPTIONS: DropListOption<FontFamily>[] = [
    { id: "Arial", name: "Arial" },
    { id: "Georgia", name: "Georgia" },
    { id: "Times New Roman", name: "Times New Roman" },
    { id: "Courier New", name: "Courier New" },
];

const SIZE_OPTIONS: DropListOption<FontSize>[] = [
    "12", "14", "16", "18", "20", "22", "24", "28", "32", "48"
].map(size => ({ id: size as FontSize, name: size }));

function toHexColor(color: string = "#000000"): string {
    if (color.startsWith("#")) return color;
    const rgb = color.match(/\d+/g);
    return rgb && rgb.length >= 3
        ? "#" + rgb.slice(0, 3).map(x => Number(x).toString(16).padStart(2, "0")).join("")
        : "#000000";
}

function TextPanel({ selectedTextObject, placement = "bottom" }: TextPanelProps) {
    const currentStyle = selectedTextObject.content[0]?.style || {
        fontFamily: "Arial",
        fontSize: 16,
        fontColor: "#000000",
    };
    const savedRange = useRef<Range | null>(null);
    const saveSelection = () => {
        const sel = window.getSelection();
        const editor = document.querySelector('[contenteditable="true"]');
        if (sel && sel.rangeCount > 0 && editor?.contains(sel.getRangeAt(0).commonAncestorContainer)) {
            savedRange.current = sel.getRangeAt(0).cloneRange();
        }
    };
    const applyStyle = (
        command: string,
        value: string | undefined,
        fallbackPatch: Partial<InlineStyle>,
        afterExec?: (editor: HTMLElement) => void
    ) => {
        const editor = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
        const sel = window.getSelection();
        if (sel && savedRange.current) {
            sel.removeAllRanges();
            sel.addRange(savedRange.current);
        }
        if (editor && savedRange.current && !savedRange.current.collapsed) {
            if (command !== "foreColor") editor.focus();
            document.execCommand("styleWithCSS", false, "true");
            document.execCommand(command, false, value);
            afterExec?.(editor);
            saveSelection();
            editor.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
            dispatch(updateTextModifier, {
                ...selectedTextObject,
                content: selectedTextObject.content.map(chunk => ({
                    ...chunk,
                    style: { ...chunk.style, ...fallbackPatch }
                }))
            });
        }
    };
    const handleSizeChange = (size: FontSize) => {
        applyStyle("fontSize", "7", { fontSize: Number(size) }, (editor) => {
            editor.querySelectorAll<HTMLElement>("span, font").forEach(el => {
                if (el.getAttribute("size") === "7" || el.style.fontSize.includes("xxx-large")) {
                    el.removeAttribute("size");
                    el.style.fontSize = `${size}px`;
                }
            });
        });
    };
    const handleFormat = (e: React.MouseEvent, cmd: "bold" | "italic" | "underline") => {
        e.preventDefault();
        saveSelection();
        applyStyle(cmd, undefined, { [cmd]: !currentStyle[cmd] });
    };
    const handleAlign = (e: React.MouseEvent, textAlign: "left" | "center" | "right") => {
        e.preventDefault();
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
            onMouseDown={(e) => {
                saveSelection();
                if (!(e.target as HTMLElement).closest("select, input, option")) {
                    e.preventDefault();
                }
            }}
        >
            <div className={styles.group}>
                <DropList
                    defaultValue={currentStyle.fontFamily}
                    onChange={(font) => applyStyle("fontName", font, { fontFamily: font })}
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
                    onChange={(e) => applyStyle("foreColor", e.target.value, { fontColor: e.target.value })}
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