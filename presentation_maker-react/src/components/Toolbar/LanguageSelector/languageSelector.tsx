import React from "react";
import { getCurrentLang, setLang } from "../../../services/languageChoose/i18n";
import type { Lang } from "../../../services/languageChoose/i18n";
import styles from "./languageSelector.module.css"

function LanguageSelector() {
    const currentLang = getCurrentLang();
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLang(e.target.value as Lang);
    };
    return (
        <div className={styles.container}>
            <select value={currentLang}  onChange={handleChange} className={styles.select} aria-label="Choose Lang">
                <option value="ru">RU</option>
                <option value="en">EN</option>
            </select>
        </div>
    )
}

export {LanguageSelector}