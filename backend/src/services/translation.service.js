const { LingoDotDevEngine } = require("lingo.dev/sdk");

const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

/**
 * Translate text into multiple languages
 */
async function translateEventText(text) {
  if (!text) return {};
  
  try {
    // Current supported target languages
    const targetLocales = ["hi", "bn", "gu", "mr", "ta"];

    const results = await lingo.batchLocalizeText(text, {
      sourceLocale: "en",
      targetLocales,
    });

    // Map results to language keys
    const translations = {};
    targetLocales.forEach((lang, index) => {
      translations[lang] = results[index];
    });

    return translations;

  } catch (error) {
    console.error("Translation failed:", error.message);
    // Fallback → return empty
    return {};
  }
}

module.exports = {
  translateEventText
};
