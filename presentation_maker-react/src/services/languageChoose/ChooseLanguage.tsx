import { getCurrentLang, setLang } from "./i18n";
import { DropList } from "../../components/common/dropList/DropList";
import type { DropListOption } from "../../components/common/dropList/DropList"; 

type Lang = 'ru' | 'en'

function LanguageSelector() {
    const currentLang = getCurrentLang();
    const handleChange = (value: Lang) => {
        setLang(value);
    };
    const langOptions: DropListOption<Lang>[] = [
        { id: "ru" as const, name: "RU" },
        { id: "en" as const, name: "EN" },
    ];
    return (
        <DropList
            value={currentLang}
            onChange={handleChange}
            options={langOptions} 
        />
    );
}

export { LanguageSelector };