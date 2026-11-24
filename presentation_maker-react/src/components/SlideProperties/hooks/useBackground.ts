
import { useEffect, useState } from "react";
import { getBackgroundStyle } from "../../../modules/editor";
import type { Slide } from "../../../../../types/slide";

type BackgroundDraft =
    | { type: "color"; color: string }
    | { type: "gradient"; colors: [string, string]; angle: number }
    | { type: "image"; image: string }
    | { type: "reset" };

type UseBackgroundProps = {
    slideRef: React.RefObject<HTMLDivElement | null>;
    slide: Slide;
};

function useBackground({ slideRef, slide }: UseBackgroundProps) {
    const [isGradientOpen, setIsGradientOpen] = useState(false);

    const initialColor =
        slide.background?.type === "color" || slide.background?.type === "solid"
            ? slide.background.color
            : "#FFFFFF";

    const [draftColor, setDraftColor] = useState(initialColor);
    const [gradientColors, setGradientColors] = useState<[string, string]>(["#FFFFFF", "#FFFFFF"]);
    const [gradientAngle, setGradientAngle] = useState<number | "">(90);
    const [backgroundDraft, setBackgroundDraft] = useState<BackgroundDraft | null>(null);

    useEffect(() => {
        setDraftColor(
            slide.background?.type === "color" || slide.background?.type === "solid"
                ? slide.background.color
                : "#FFFFFF"
        );
    }, [slide]);

    const restoreSlideBackground = () => {
        const element = slideRef.current;
        if (!element) return;

        const style = getBackgroundStyle(slide.background);

        element.style.background = "";
        element.style.backgroundColor = "";
        element.style.backgroundImage = "";
        element.style.backgroundSize = "";
        element.style.backgroundPosition = "";

        Object.assign(element.style, style);
    };

    const updatePreview = (draft: BackgroundDraft) => {
        const element = slideRef.current;
        if (!element) return;
        switch (draft.type) {
            case "color":
                element.style.background = draft.color;
                break;
            case "gradient":
                element.style.background =
                    `linear-gradient(${draft.angle}deg, ${draft.colors.join(", ")})`;
                break;
            case "image":
                element.style.background =
                    `url("${draft.image}") center / cover no-repeat`;
                break;
            case "reset":
                restoreSlideBackground();
                break;
        }
    };

    const applyDraft = (draft: BackgroundDraft) => {
        setBackgroundDraft(draft);
        updatePreview(draft);
    };

    const handleColorChange = (color: string) => {
        setDraftColor(color);
        applyDraft({ type: "color", color });
    };

    const handleGradientColorChange = (index: 0 | 1, color: string) => {
        const colors: [string, string] = [...gradientColors];
        colors[index] = color;
        const angle = gradientAngle === "" ? 90 : gradientAngle;
        setGradientColors(colors);
        applyDraft({
            type: "gradient",
            colors,
            angle
        });
    };

    const handleGradientAngleChange = (angle: number | "") => {
        setGradientAngle(angle);
        if (angle === "") return;

        applyDraft({
            type: "gradient",
            colors: gradientColors,
            angle
        });
    };

    const handleImageChange = (file: File | undefined) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result !== "string") return;
            applyDraft({ type: "image", image: result });
        };

        reader.readAsDataURL(file);
    };

    const handleReset = () => {
        applyDraft({ type: "reset" });
    };

    const handleCancel = () => {
        restoreSlideBackground();
        setBackgroundDraft(null);
    };

    return {
        isGradientOpen,
        setIsGradientOpen,
        draftColor,
        setDraftColor,
        gradientColors,
        gradientAngle,
        backgroundDraft,
        handleColorChange,
        handleGradientColorChange,
        handleGradientAngleChange,
        handleImageChange,
        handleReset,
        handleCancel
    };
}

export {useBackground}