import {
  LANGUAGES,
  POPULAR_LANGUAGES,
  OTHER_LANGUAGES,
  getLanguageByCode,
  searchLanguages,
} from "@/data/languages";

describe("Languages Data Module", () => {
  describe("LANGUAGES array", () => {
    it("should contain at least 100 languages", () => {
      expect(LANGUAGES.length).toBeGreaterThanOrEqual(100);
    });

    it("should have valid structure for each language", () => {
      LANGUAGES.forEach((lang) => {
        expect(lang).toHaveProperty("code");
        expect(lang).toHaveProperty("englishName");
        expect(lang).toHaveProperty("nativeName");
        expect(lang).toHaveProperty("flag");
        expect(typeof lang.code).toBe("string");
        expect(typeof lang.englishName).toBe("string");
        expect(typeof lang.nativeName).toBe("string");
        expect(typeof lang.flag).toBe("string");
        expect(lang.code.length).toBeGreaterThan(0);
        expect(lang.englishName.length).toBeGreaterThan(0);
        expect(lang.nativeName.length).toBeGreaterThan(0);
      });
    });

    it("should have unique language codes", () => {
      const codes = LANGUAGES.map((lang) => lang.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });

    it("should include popular languages like English, Spanish, French", () => {
      const codes = LANGUAGES.map((lang) => lang.code);
      expect(codes).toContain("en");
      expect(codes).toContain("es");
      expect(codes).toContain("fr");
      expect(codes).toContain("de");
      expect(codes).toContain("zh");
      expect(codes).toContain("ja");
      expect(codes).toContain("ar");
      expect(codes).toContain("hi");
    });
  });

  describe("POPULAR_LANGUAGES", () => {
    it("should contain languages marked as popular", () => {
      POPULAR_LANGUAGES.forEach((lang) => {
        expect(lang.isPopular).toBe(true);
      });
    });

    it("should have at least 10 popular languages", () => {
      expect(POPULAR_LANGUAGES.length).toBeGreaterThanOrEqual(10);
    });

    it("should be a subset of LANGUAGES", () => {
      POPULAR_LANGUAGES.forEach((popularLang) => {
        const found = LANGUAGES.find((lang) => lang.code === popularLang.code);
        expect(found).toBeDefined();
      });
    });
  });

  describe("OTHER_LANGUAGES", () => {
    it("should not contain popular languages", () => {
      OTHER_LANGUAGES.forEach((lang) => {
        expect(lang.isPopular).not.toBe(true);
      });
    });

    it("should combine with POPULAR_LANGUAGES to equal LANGUAGES", () => {
      const combined = [...POPULAR_LANGUAGES, ...OTHER_LANGUAGES];
      expect(combined.length).toBe(LANGUAGES.length);
    });
  });

  describe("getLanguageByCode", () => {
    it("should return language object for valid code", () => {
      const spanish = getLanguageByCode("es");
      expect(spanish).toBeDefined();
      expect(spanish?.code).toBe("es");
      expect(spanish?.englishName).toBe("Spanish");
    });

    it("should return undefined for invalid code", () => {
      const invalid = getLanguageByCode("invalid-code");
      expect(invalid).toBeUndefined();
    });

    it("should handle case-sensitive codes", () => {
      const english = getLanguageByCode("en");
      expect(english).toBeDefined();
      expect(english?.code).toBe("en");
    });

    it("should work for all languages in the dataset", () => {
      LANGUAGES.forEach((lang) => {
        const found = getLanguageByCode(lang.code);
        expect(found).toBeDefined();
        expect(found?.code).toBe(lang.code);
      });
    });
  });

  describe("searchLanguages", () => {
    it("should return all languages for empty query", () => {
      const results = searchLanguages("");
      expect(results.length).toBe(LANGUAGES.length);
    });

    it("should return all languages for whitespace query", () => {
      const results = searchLanguages("   ");
      expect(results.length).toBe(LANGUAGES.length);
    });

    it("should search by English name", () => {
      const results = searchLanguages("Spanish");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((lang) => lang.code === "es")).toBe(true);
    });

    it("should search by native name", () => {
      const results = searchLanguages("Español");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((lang) => lang.code === "es")).toBe(true);
    });

    it("should search by language code", () => {
      const results = searchLanguages("es");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((lang) => lang.code === "es")).toBe(true);
    });

    it("should be case-insensitive", () => {
      const lowerResults = searchLanguages("spanish");
      const upperResults = searchLanguages("SPANISH");
      const mixedResults = searchLanguages("SpAnIsH");

      expect(lowerResults.length).toBeGreaterThan(0);
      expect(upperResults.length).toBeGreaterThan(0);
      expect(mixedResults.length).toBeGreaterThan(0);
      expect(lowerResults.length).toBe(upperResults.length);
      expect(lowerResults.length).toBe(mixedResults.length);
    });

    it("should return partial matches", () => {
      const results = searchLanguages("jap");
      expect(results.some((lang) => lang.code === "ja")).toBe(true);
    });

    it("should return empty array for no matches", () => {
      const results = searchLanguages("xyzabc123");
      expect(results.length).toBe(0);
    });

    it("should search across multiple language fields", () => {
      const japaneseResults = searchLanguages("Japanese");
      expect(japaneseResults.some((lang) => lang.code === "ja")).toBe(true);

      const nativeResults = searchLanguages("日本語");
      expect(nativeResults.some((lang) => lang.code === "ja")).toBe(true);
    });
  });
});
