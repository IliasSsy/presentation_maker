import { Button } from "../../common/button/Button";
import styles from "../Toolbar.module.css"

type ToolbarButtonProps = {
    tooltipKey: string;
    icon: string;
    onClick?: () => void;
}

function ToolbarButton({ tooltipKey, icon, onClick }: ToolbarButtonProps) {
    return (
        <Button tooltipKey={tooltipKey} onClick={onClick || (() => {})}>
            <img src={icon} alt={tooltipKey} className={styles.img} />
        </Button>
    );
}

export {ToolbarButton}