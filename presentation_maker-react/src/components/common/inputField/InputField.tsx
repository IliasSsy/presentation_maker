import styles from "./InputField.module.css";

type InputFieldProps = {
    value?: string | number; 
    onChange: (value: string, files: FileList | null) => void; 
    className?: string;
    type?: string;
    placeholder?: string;
    accept?: string; 
}

function InputField({ value, onChange, className = "", type = "text", placeholder, accept }: InputFieldProps) {
    return (
        <input 
            type={type}
            value={type === "file" ? undefined : value}
            accept={accept}
            placeholder={placeholder}
            onChange={(event) => {
                onChange(event.target.value, event.target.files);
            }}
            className={`${styles.input} ${className}`.trim()}
        />
    );
}

export { InputField };