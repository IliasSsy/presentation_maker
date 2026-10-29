import styles from "./DropList.module.css";

type DropListOption<T extends string> = {
    id: T;
    name: string;
};

type DropListProps<T extends string> = {
    options: DropListOption<T>[]; 
    value?: string;
    defaultValue?: string;
    onChange: (value: T) => void;
}

function DropList<T extends string>({ options, value, defaultValue, onChange }: DropListProps<T>) {
    return (
        <div className={styles.wrapper}>
            <select 
                className={styles.select} 
                value={value} 
                defaultValue={defaultValue}
                onChange={(event) => onChange(event.target.value as T)}
            >
                {options.map((option) => (
                    <option value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export { DropList };
export type { DropListOption };