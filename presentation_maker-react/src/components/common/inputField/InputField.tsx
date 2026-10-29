import styles from "./InputField.module.css";

type InputFieldProps = {
    value: string;
    onChange: (value: string) => void; 
    className?: string;
    placeholder?: string;
}

function InputField({ value, onChange, className = "" }: InputFieldProps) {
    return (
        <input 
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={`${styles.input} ${className}`.trim()}
        />
    );
}

export { InputField };