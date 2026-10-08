import styles from "./scaleInput.module.css";

function ScaleInputField() {
    return (
        <div className={styles.wrapper}>
            <select className={styles.select} defaultValue="100%">
                <option value="50%">50%</option>
                <option value="75%">75%</option>
                <option value="100%">100%</option>
                <option value="125%">125%</option>
                <option value="150%">150%</option>
                <option value="200%">200%</option>
            </select>
        </div>
    );
}
export {ScaleInputField}