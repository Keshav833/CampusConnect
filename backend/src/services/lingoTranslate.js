const axios = require("axios");

/**
 * Translates text using Lingo AI API.
 * @param {string} text - The text to translate.
 * @param {string} targetLang - The ISO code of the target language (e.g., 'hi', 'mr', 'ta').
 * @returns {Promise<string>} - The translated text or original text as fallback.
 */
const translateText = async (text, targetLang) => {
  // Return original text if no API key is provided (demo/fallback mode)
  if (!process.env.LINGO_API_KEY || process.env.LINGO_API_KEY === "your_lingo_api_key_here") {
    console.warn(`Lingo API Key missing. Skipping translation for: ${targetLang}`);
    return text;
  }

  try {
    const response = await axios.post(
      "https://api.lingo.dev/v1/translate",
      {
        text,
        target_language: targetLang,
        project_id: process.env.LINGO_PROJECT_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LINGO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.translation || text;
  } catch (error) {
    console.error(`Lingo Translation Error (${targetLang}):`, error.response?.data || error.message);
    return text; // fallback to original text
  }
};

module.exports = translateText;
