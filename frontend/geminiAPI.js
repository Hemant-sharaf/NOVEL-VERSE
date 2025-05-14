// geminiapi.js

// Check for API key
const GEMINI_API_KEY = window.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("❌ Gemini API key is missing. Please set window.GEMINI_API_KEY before using the API.");
}

/**
 * Generates a novel using the Gemini API
 * @param {string} description - The core idea or prompt for the novel
 * @param {string} genre - The genre of the novel (e.g., Sci-fi, Mystery, Fantasy)
 * @param {number} numChapters - Number of chapters to include
 * @returns {Promise<Object|null>} - Novel object with title, background, genre, and chapters
 */
export async function generateNovel(description, genre, numChapters) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: `Generate a novel in the "${genre}" genre.
- Title: Clearly mention it at the beginning.
- Description: Based on the following prompt: "${description}"
- Chapters: Write ${numChapters} immersive and well-structured chapters.
- Use rich storytelling, strong character development, and smooth flow.
- Format: Start with "Title: <Your Title>" followed by chapters.`
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topK: 40,
            topP: 0.95
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("📦 API Response:", data);

        if (data.error) {
            console.error("❌ Gemini API Error:", data.error);
            alert(`API Error: ${data.error.message} (Code: ${data.error.code})`);
            return null;
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (!text) {
            console.error("❌ No text returned from Gemini.");
            return null;
        }

        // Extract title
        const titleMatch = text.match(/(?:\*\*Title:\*\*|Title:|#\s*)\s*(.+)/i);
        const title = titleMatch ? titleMatch[1].trim() : "Untitled Story";

        // Extract chapters
        const chapters = text.match(/Chapter \d+:([\s\S]*?)(?=Chapter \d+:|$)/g) || [];

        return {
            title,
            background: `A ${genre} novel inspired by: "${description}"`,
            genre,
            chapters
        };
    } catch (error) {
        console.error("❌ Network or fetch error:", error);
        alert("Network or fetch error. See console for details.");
        return null;
    }
}
