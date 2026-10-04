import React from "react";

interface PlusButtonProps {
    onClick: () => void;
    className?: string;
}

function PlusButton({ onClick, className = '' }: PlusButtonProps) {
    return (
        <button onClick={onClick} className={className}>
            +   
        </button>
    );
}

export { PlusButton };