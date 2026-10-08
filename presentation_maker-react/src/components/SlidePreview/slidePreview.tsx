import type { Slide } from "../../../../types/slide";
import { SlideObjectComp } from "../SlideObject/slideObject";
import styles from "./slidePreview.module.css";

interface SlidePreviewProps {
    slide: Slide;
}

function SlidePreview({ slide }: SlidePreviewProps) {
    const getBackgroundStyle = () => {
        const backgroundSlide = slide.background;
        if (!backgroundSlide || backgroundSlide.type === "none") {
            return { backgroundColor: "#ffffff" };
        }
        if (backgroundSlide.type === "color") {
            return { backgroundColor: backgroundSlide.color };
        }
        if (backgroundSlide.type === "image") {
            return { 
                backgroundImage: `url(${backgroundSlide.url})`, 
                backgroundSize: "cover",
                backgroundPosition: "center"
            };
        }
        if (backgroundSlide.type === "gradient") {
            const angle = backgroundSlide.angle ?? 0;
            const colorsString = backgroundSlide.colors.join(", ");
            return {
                background: `linear-gradient(${angle}deg, ${colorsString})`
            };
        }
        return { backgroundColor: "#ffffff" };
    };

    return (
        <div className={styles.slide} style={getBackgroundStyle()}>
            {slide.elements.map((element) => (
                <SlideObjectComp key={element.id} object={element} />
            ))}
        </div>
    );
}

export { SlidePreview };