import styles from "./InputField.module.css";

type InputFieldProps = {
    value: string;
    onChange: (value: string) => void; 
    className?: string;
    type?: string
    placeholder?: string;
}

function InputField({ value, onChange, className = "", type = "text" }: InputFieldProps) {
    return (
        <input 
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={`${styles.input} ${className}`.trim()}
        />
    );
}

export { InputField };