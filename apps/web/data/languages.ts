export interface LanguageData {
  code: string;
  englishName: string;
  nativeName: string;
  flag: string;
  isPopular?: boolean;
}

export const LANGUAGES: LanguageData[] = [
  // Popular languages (shown first)
  { code: "en", englishName: "English", nativeName: "English", flag: "🇬🇧", isPopular: true },
  { code: "es", englishName: "Spanish", nativeName: "Español", flag: "🇪🇸", isPopular: true },
  { code: "fr", englishName: "French", nativeName: "Français", flag: "🇫🇷", isPopular: true },
  { code: "de", englishName: "German", nativeName: "Deutsch", flag: "🇩🇪", isPopular: true },
  { code: "it", englishName: "Italian", nativeName: "Italiano", flag: "🇮🇹", isPopular: true },
  { code: "pt", englishName: "Portuguese", nativeName: "Português", flag: "🇵🇹", isPopular: true },
  { code: "zh", englishName: "Chinese", nativeName: "中文", flag: "🇨🇳", isPopular: true },
  { code: "ja", englishName: "Japanese", nativeName: "日本語", flag: "🇯🇵", isPopular: true },
  { code: "ko", englishName: "Korean", nativeName: "한국어", flag: "🇰🇷", isPopular: true },
  { code: "ru", englishName: "Russian", nativeName: "Русский", flag: "🇷🇺", isPopular: true },
  { code: "ar", englishName: "Arabic", nativeName: "العربية", flag: "🇸🇦", isPopular: true },
  { code: "hi", englishName: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", isPopular: true },

  // All other languages (alphabetically by English name)
  { code: "af", englishName: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦" },
  { code: "sq", englishName: "Albanian", nativeName: "Shqip", flag: "🇦🇱" },
  { code: "am", englishName: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹" },
  { code: "hy", englishName: "Armenian", nativeName: "Հայերեն", flag: "🇦🇲" },
  { code: "az", englishName: "Azerbaijani", nativeName: "Azərbaycanca", flag: "🇦🇿" },
  { code: "eu", englishName: "Basque", nativeName: "Euskara", flag: "🏴" },
  { code: "be", englishName: "Belarusian", nativeName: "Беларуская", flag: "🇧🇾" },
  { code: "bn", englishName: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "bs", englishName: "Bosnian", nativeName: "Bosanski", flag: "🇧🇦" },
  { code: "bg", englishName: "Bulgarian", nativeName: "Български", flag: "🇧🇬" },
  { code: "my", englishName: "Burmese", nativeName: "ဗမာစာ", flag: "🇲🇲" },
  { code: "ca", englishName: "Catalan", nativeName: "Català", flag: "🏴" },
  { code: "ceb", englishName: "Cebuano", nativeName: "Cebuano", flag: "🇵🇭" },
  { code: "ny", englishName: "Chichewa", nativeName: "Chichewa", flag: "🇲🇼" },
  { code: "co", englishName: "Corsican", nativeName: "Corsu", flag: "🇫🇷" },
  { code: "hr", englishName: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷" },
  { code: "cs", englishName: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "da", englishName: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "nl", englishName: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "eo", englishName: "Esperanto", nativeName: "Esperanto", flag: "🌍" },
  { code: "et", englishName: "Estonian", nativeName: "Eesti", flag: "🇪🇪" },
  { code: "fil", englishName: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
  { code: "fi", englishName: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "fy", englishName: "Frisian", nativeName: "Frysk", flag: "🇳🇱" },
  { code: "gl", englishName: "Galician", nativeName: "Galego", flag: "🏴" },
  { code: "ka", englishName: "Georgian", nativeName: "ქართული", flag: "🇬🇪" },
  { code: "el", englishName: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "gu", englishName: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "ht", englishName: "Haitian Creole", nativeName: "Kreyòl Ayisyen", flag: "🇭🇹" },
  { code: "ha", englishName: "Hausa", nativeName: "Hausa", flag: "🇳🇬" },
  { code: "haw", englishName: "Hawaiian", nativeName: "ʻŌlelo Hawaiʻi", flag: "🇺🇸" },
  { code: "iw", englishName: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
  { code: "hmn", englishName: "Hmong", nativeName: "Hmoob", flag: "🌏" },
  { code: "hu", englishName: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
  { code: "is", englishName: "Icelandic", nativeName: "Íslenska", flag: "🇮🇸" },
  { code: "ig", englishName: "Igbo", nativeName: "Igbo", flag: "🇳🇬" },
  { code: "id", englishName: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ga", englishName: "Irish", nativeName: "Gaeilge", flag: "🇮🇪" },
  { code: "jv", englishName: "Javanese", nativeName: "Basa Jawa", flag: "🇮🇩" },
  { code: "kn", englishName: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "kk", englishName: "Kazakh", nativeName: "Қазақша", flag: "🇰🇿" },
  { code: "km", englishName: "Khmer", nativeName: "ភាសាខ្មែរ", flag: "🇰🇭" },
  { code: "rw", englishName: "Kinyarwanda", nativeName: "Ikinyarwanda", flag: "🇷🇼" },
  { code: "ku", englishName: "Kurdish", nativeName: "Kurdî", flag: "🌏" },
  { code: "ky", englishName: "Kyrgyz", nativeName: "Кыргызча", flag: "🇰🇬" },
  { code: "lo", englishName: "Lao", nativeName: "ລາວ", flag: "🇱🇦" },
  { code: "la", englishName: "Latin", nativeName: "Latina", flag: "🏛️" },
  { code: "lv", englishName: "Latvian", nativeName: "Latviešu", flag: "🇱🇻" },
  { code: "lt", englishName: "Lithuanian", nativeName: "Lietuvių", flag: "🇱🇹" },
  { code: "lb", englishName: "Luxembourgish", nativeName: "Lëtzebuergesch", flag: "🇱🇺" },
  { code: "mk", englishName: "Macedonian", nativeName: "Македонски", flag: "🇲🇰" },
  { code: "mg", englishName: "Malagasy", nativeName: "Malagasy", flag: "🇲🇬" },
  { code: "ms", englishName: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "ml", englishName: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "mt", englishName: "Maltese", nativeName: "Malti", flag: "🇲🇹" },
  { code: "mi", englishName: "Maori", nativeName: "Te Reo Māori", flag: "🇳🇿" },
  { code: "mr", englishName: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "mn", englishName: "Mongolian", nativeName: "Монгол", flag: "🇲🇳" },
  { code: "ne", englishName: "Nepali", nativeName: "नेपाली", flag: "🇳🇵" },
  { code: "no", englishName: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "or", englishName: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "ps", englishName: "Pashto", nativeName: "پښتو", flag: "🇦🇫" },
  { code: "fa", englishName: "Persian", nativeName: "فارسی", flag: "🇮🇷" },
  { code: "pl", englishName: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "pa", englishName: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ro", englishName: "Romanian", nativeName: "Română", flag: "🇷🇴" },
  { code: "sm", englishName: "Samoan", nativeName: "Gagana Samoa", flag: "🇼🇸" },
  { code: "gd", englishName: "Scots Gaelic", nativeName: "Gàidhlig", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { code: "sr", englishName: "Serbian", nativeName: "Српски", flag: "🇷🇸" },
  { code: "st", englishName: "Sesotho", nativeName: "Sesotho", flag: "🇱🇸" },
  { code: "sn", englishName: "Shona", nativeName: "Shona", flag: "🇿🇼" },
  { code: "sd", englishName: "Sindhi", nativeName: "سنڌي", flag: "🇵🇰" },
  { code: "si", englishName: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰" },
  { code: "sk", englishName: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰" },
  { code: "sl", englishName: "Slovenian", nativeName: "Slovenščina", flag: "🇸🇮" },
  { code: "so", englishName: "Somali", nativeName: "Soomaali", flag: "🇸🇴" },
  { code: "su", englishName: "Sundanese", nativeName: "Basa Sunda", flag: "🇮🇩" },
  { code: "sw", englishName: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  { code: "sv", englishName: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "tg", englishName: "Tajik", nativeName: "Тоҷикӣ", flag: "🇹🇯" },
  { code: "ta", englishName: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "tt", englishName: "Tatar", nativeName: "Татарча", flag: "🇷🇺" },
  { code: "te", englishName: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "th", englishName: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "tr", englishName: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "tk", englishName: "Turkmen", nativeName: "Türkmençe", flag: "🇹🇲" },
  { code: "uk", englishName: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  { code: "ur", englishName: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { code: "ug", englishName: "Uyghur", nativeName: "ئۇيغۇرچە", flag: "🇨🇳" },
  { code: "uz", englishName: "Uzbek", nativeName: "Oʻzbekcha", flag: "🇺🇿" },
  { code: "vi", englishName: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "cy", englishName: "Welsh", nativeName: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "xh", englishName: "Xhosa", nativeName: "isiXhosa", flag: "🇿🇦" },
  { code: "yi", englishName: "Yiddish", nativeName: "ייִדיש", flag: "🌍" },
  { code: "yo", englishName: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬" },
  { code: "zu", englishName: "Zulu", nativeName: "isiZulu", flag: "🇿🇦" },
];

export const POPULAR_LANGUAGES = LANGUAGES.filter((lang) => lang.isPopular);
export const OTHER_LANGUAGES = LANGUAGES.filter((lang) => !lang.isPopular);

export function getLanguageByCode(code: string): LanguageData | undefined {
  return LANGUAGES.find((lang) => lang.code === code);
}

export function searchLanguages(query: string): LanguageData[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return LANGUAGES;

  return LANGUAGES.filter(
    (lang) =>
      lang.englishName.toLowerCase().includes(lowerQuery) ||
      lang.nativeName.toLowerCase().includes(lowerQuery) ||
      lang.code.toLowerCase().includes(lowerQuery)
  );
}
