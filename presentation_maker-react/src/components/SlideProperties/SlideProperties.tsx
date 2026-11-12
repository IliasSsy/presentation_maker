import React, { useRef, useState } from "react";
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

type SlidePropertiesProps = {
    slide: Slide;
    onClose: () => void;
};

function SlideProperties({ slide, onClose }: SlidePropertiesProps) {
    const colorInputRef = useRef<HTMLInputElement>(null);
    const { fileInputRef, triggerUpload } = useImageUpload();
    const [isGradientOpen, setIsGradientOpen] = useState(false);
    const [gradientColors, setGradientColors] = useState<string[]>(["#ffffff", "#ffffff"]);
    const [gradientAngle, setGradientAngle] = useState<number>(90);
    const currentColor = slide.background?.type === 'color' ? slide.background.color : '#ffffff';

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (result) {
                    dispatch(setSlideBackgroundImageModifier, result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Фон</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <div className={styles.section}>
                    <span className={styles.label}>Цвет</span>
                    <input 
                        type="color" 
                        ref={colorInputRef}
                        defaultValue={currentColor}
                        onInput={(e) => dispatch(setSlideBackgroundColorModifier, (e.target as HTMLInputElement).value)}
                        className={styles.colorPicker}
                    />
                </div>
                <div className={styles.gradientSection}>
                    <div className={styles.section} style={{ marginBottom: isGradientOpen ? '12px' : '0' }}>
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
                                        onChange={(e) => {
                                            const newColors = [e.target.value, gradientColors[1]];
                                            setGradientColors(newColors);
                                            dispatch(setSlideBackgroundGradientModifier, newColors, gradientAngle);
                                        }}
                                    />
                                </label>
                                <label>
                                    Цвет 2:
                                    <input 
                                        type="color" 
                                        value={gradientColors[1]}
                                        onChange={(e) => {
                                            const newColors = [gradientColors[0], e.target.value];
                                            setGradientColors(newColors);
                                            dispatch(setSlideBackgroundGradientModifier, newColors, gradientAngle);
                                        }}
                                    />
                                </label>
                                <label className={styles.angleLabel}>
                                    Угол:
                                    <input 
                                        type="number" 
                                        value={gradientAngle}
                                        min="0"
                                        max="360"
                                        onChange={(e) => {
                                            const newAngle = Number(e.target.value);
                                            setGradientAngle(newAngle);
                                            dispatch(setSlideBackgroundGradientModifier, gradientColors, newAngle);
                                        }}
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
                        onChange={handleImageChange} 
                        style={{ display: 'none' }} 
                    />
                </div>
                <div className={styles.section}>
                    <span className={styles.label}>Исходный фон</span>
                    <button 
                        className={styles.resetBtn} 
                        onClick={() => dispatch(clearSlideBackgroundModifier)}
                    >
                        Сбросить
                    </button>
                </div>
                <div className={styles.footer}>
                    <button className={styles.primaryBtn} onClick={onClose}>
                        Готово
                    </button>
                </div>
            </div>
        </div>
    );
}

export { SlideProperties };