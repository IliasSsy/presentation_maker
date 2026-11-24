import { Button } from "../../common/button/Button";
import styles from "../Toolbar.module.css";

type ToolbarButtonProps = {
    tooltipKey: string;
    icon: string;
    onClick?: () => void;
    disabled?: boolean;
};

function ToolbarButton({ tooltipKey, icon, onClick, disabled = false }: ToolbarButtonProps) {
    return (
        <Button
            tooltipKey={tooltipKey}
            onClick={disabled ? () => {} : (onClick || (() => {}))}
        >
            <img
                src={icon}
                alt={tooltipKey}
                className={`${styles.img} ${disabled ? styles.disabled : ""}`}
            />
        </Button>
    );
}

export { ToolbarButton };