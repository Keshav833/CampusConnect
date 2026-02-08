const axios = require("axios");

/**
 * Translates text using Lingo AI API.
 * @param {string} text - The text to translate.
 * @param {string} targetLang - The ISO code of the target language (e.g., 'hi', 'mr', 'ta').
 * @returns {Promise<string>} - The translated text or original text as fallback.
 */
const translateText = async (text, targetLang, retries = 2) => {
  // Return original text if no API key is provided (demo/fallback mode)
  if (!process.env.LINGO_API_KEY || process.env.LINGO_API_KEY === "api_ub1y8tlaq3flvw0352iwtydp") {
    // Note: Leaving the hardcoded check for the provided demo key, but adding warning
    if (process.env.LINGO_API_KEY === "api_ub1y8tlaq3flvw0352iwtydp") {
      console.log(`Using Demo Lingo Key for translation (${targetLang})`);
    } else {
      console.warn(`Lingo API Key missing. Skipping translation for: ${targetLang}`);
      return text;
    }
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        "https://api.lingo.dev/v1/translate",
        {
          text,
          target_language: targetLang,
          project_id: process.env.LINGO_PROJECT_ID || "demo_project",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.LINGO_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      return response.data.translation || text;
    } catch (error) {
      const status = error.response?.status;
      console.error(`Lingo Translation Attempt ${attempt + 1} Failed (${targetLang}):`, 
        error.response?.data?.error || error.message
      );

      if (attempt < retries && (status === 429 || status >= 500)) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(res => setTimeout(res, delay));
        continue;
      }
      return text; // Final fallback
    }
  }
};

module.exports = translateText;
