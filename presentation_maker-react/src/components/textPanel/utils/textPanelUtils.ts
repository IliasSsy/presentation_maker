
import { dispatch } from "../../../modules/editor";
import { updateTextModifier } from "../../../modules/modifiers";
import type { TextObject, InlineStyle } from "../../../../../types/objects.js";
import type { DropListOption } from "../../common/dropList/DropList.js";

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
    if (!rgb || rgb.length < 3) return "#000000";
    const [r, g, b] = rgb;
    const toHex = (n: string) => Number(n).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function applyTextStyle(
    selectedTextObject: TextObject,
    savedRangeRef: React.MutableRefObject<Range | null>,
    command: string,
    fallbackPatch: Partial<InlineStyle>,
    value?: string,
    afterExec?: (editor: HTMLElement) => void
) {
    const editor = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
    const selection = window.getSelection();
    
    if (selection && savedRangeRef.current) {
        selection.removeAllRanges();
        selection.addRange(savedRangeRef.current);
    }

    if (editor && savedRangeRef.current && !savedRangeRef.current.collapsed) {
        if (command !== "foreColor") editor.focus();
        document.execCommand("styleWithCSS", false, "true");
        document.execCommand(command, false, value);
        afterExec?.(editor);
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedRangeRef.current = sel.getRangeAt(0).cloneRange();
        }

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
}

export {
    type FontFamily,
    type FontSize,
    FONT_OPTIONS,
    SIZE_OPTIONS,
    toHexColor,
    applyTextStyle
}