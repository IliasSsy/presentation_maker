
import { useEffect } from "react";
import { dispatch } from "../../modules/editor.js";
import {
    setSlideBackgroundColorModifier,
    setSlideBackgroundGradientModifier,
    setSlideBackgroundImageModifier,
    clearSlideBackgroundModifier
} from "../../modules/modifiers.js";
import { useImageUpload } from "../Toolbar/hooks/useImageUpload.js";
import type { Slide } from "../../../../types/slide.js";
import styles from "./slideProperties.module.css";
import { useBackground } from "./hooks/useBackground.js";

type SlidePropertiesProps = {
    slide: Slide;
    slideRef: React.RefObject<HTMLDivElement | null>;
    onClose: () => void;
};

function SlideProperties({ slide, slideRef, onClose }: SlidePropertiesProps) {
    const { fileInputRef, triggerUpload } = useImageUpload();

    const {
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
        handleCancel: cancelPreview
    } = useBackground({ slideRef, slide });

    useEffect(() => {
        if (
            slide.background?.type === "color" ||
            slide.background?.type === "solid"
        ) {
            setDraftColor(slide.background.color);
        } else {
            setDraftColor("#FFFFFF");
        }
    }, [slide, setDraftColor]);

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        handleImageChange(file);
        e.target.value = "";
    };

    const handleApply = () => {
        if (backgroundDraft) {
            switch (backgroundDraft.type) {
                case "color":
                    dispatch(setSlideBackgroundColorModifier, backgroundDraft.color);
                    break;
                case "gradient":
                    dispatch(
                        setSlideBackgroundGradientModifier,
                        backgroundDraft.colors,
                        backgroundDraft.angle
                    );
                    break;
                case "image":
                    dispatch(setSlideBackgroundImageModifier, backgroundDraft.image);
                    break;
                case "reset":
                    dispatch(clearSlideBackgroundModifier);
                    break;
            }
        }

        onClose();
    };

    const handleCancel = () => {
        cancelPreview();
        onClose();
    };

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            handleCancel();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Фон</h2>
                    <button className={styles.closeBtn} onClick={handleCancel}>
                        ×
                    </button>
                </div>
                <div className={styles.section}>
                    <span className={styles.label}>Цвет</span>
                    <input
                        type="color"
                        value={draftColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className={styles.colorPicker}
                    />
                </div>
                <div className={styles.gradientSection}>
                    <div
                        className={styles.section}
                        style={{ marginBottom: isGradientOpen ? "12px" : "0" }}
                    >
                        <span className={styles.label}>Градиент</span>
                        <button
                            className={styles.actionBtn}
                            onClick={() => setIsGradientOpen(!isGradientOpen)}
                        >
                            {isGradientOpen ? "Закрыть" : "Настроить градиент"}
                        </button>
                    </div>
                    {isGradientOpen && (
                        <div className={styles.gradientDropdown}>
                            <div className={styles.gradientInputs}>
                                <label>
                                    Цвет 1:
                                    <input
                                        type="color"
                                        value={gradientColors[0]}
                                        onChange={(event) =>
                                            handleGradientColorChange(0, event.target.value)
                                        }
                                    />
                                </label>
                                <label>
                                    Цвет 2:
                                    <input
                                        type="color"
                                        value={gradientColors[1]}
                                        onChange={(event) =>
                                            handleGradientColorChange(1, event.target.value)
                                        }
                                    />
                                </label>
                                <label className={styles.angleLabel}>
                                    Угол:
                                    <input
                                        type="number"
                                        value={gradientAngle}
                                        min="0"
                                        max="360"
                                        onChange={(event) =>
                                            handleGradientAngleChange(
                                                event.target.value ? Number(event.target.value) : 
                                            "")
                                        }
                                        className={styles.angleInput}
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.section}>
                    <span className={styles.label}>Изображение</span>
                    <button className={styles.actionBtn} onClick={triggerUpload}>
                        Выбрать изображение
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={onFileInputChange}
                        style={{ display: "none" }}
                    />
                </div>
                <div className={styles.section}>
                    <span className={styles.label}>Исходный фон</span>
                    <button className={styles.resetBtn} onClick={handleReset}>
                        Сбросить
                    </button>
                </div>
                <div className={styles.footer}>
                    <button className={styles.primaryBtn} onClick={handleApply}>
                        Готово
                    </button>
                </div>
            </div>
        </div>
    );
}

export { SlideProperties };
