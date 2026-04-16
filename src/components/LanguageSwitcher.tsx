"use client";

import { useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";

const LanguageSwitcher = () => {
  const locale = useLocale();

  const languages = [
    { code: "fr", name: "🇫🇷" },
    { code: "en", name: "🇬🇧" },
  ];

  const handleLanguageChange = (lang: string) => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="appearance-none bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-600 rounded-md px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-zinc-500" />
    </div>
  );
};

export default LanguageSwitcher;
