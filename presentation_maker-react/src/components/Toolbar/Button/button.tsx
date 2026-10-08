import type { ReactNode } from "react";
import styles from "./button.module.css"
import { translate } from "../../../services/languageChoose/i18n";

interface ToolbarButtonProps {
    children: ReactNode;
    tooltipKey: string;
    onClick: () => void;
    className?: string;
}

function ToolbarButton({ children, tooltipKey, onClick, className = '' }: ToolbarButtonProps) {
    return (
        <div className={`${styles.wrapper} ${className}`}>
            <button onClick={onClick} className={styles.button} type="button">
                {children}
            </button>
            <span className={styles.tooltip}>{translate(tooltipKey)}</span>
        </div>
    );
}

export {ToolbarButton}