const GEMINI_API_KEY = window.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("❌ Gemini API key is missing. Please set window.GEMINI_API_KEY before using the API.");
}

export async function generateNovel(description, genre, numChapters) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
        contents: [
            {
                parts: [{
                    text: `Generate a novel in the "${genre}" genre.
                    - **Title:** Clearly mention it at the beginning.
                    - **Description:** Based on: "${description}".
                    - **Chapters:** Write ${numChapters} well-structured chapters.
                    - Ensure immersive storytelling, rich details, and smooth flow.
                    - **Format:** Start with "Title: <Your Title>" followed by chapters.`
                }]
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("📦 Full API Response:", JSON.stringify(data, null, 2));

        if (data.error) {
            console.error("❌ Gemini API Error:", data.error);
            alert(`API Error: ${data.error.message} (Code: ${data.error.code})`);
            return null;
        }

        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        console.log("📝 Generated Text:", generatedText);

        if (!generatedText) {
            console.error("❌ Empty novel content received.");
            return null;
        }

        // Extract title
        const titleMatch = generatedText.match(/(?:\*\*Title:\*\*|Title:|#\s*)\s*(.+)/i);
        const title = titleMatch ? titleMatch[1].trim() : generatedText.split("\n")[0].trim() || "Untitled Story";
        console.log("🏷️ Extracted Title:", title);

        // Extract chapters
        const chapters = generatedText.match(/Chapter \d+:([\s\S]*?)(?=Chapter \d+:|$)/g) || [];

        return {
            title,
            background: `A ${genre} novel inspired by: "${description}"`,
            genre,
            chapters
        };
    } catch (error) {
        console.error("❌ Error fetching from Gemini API:", error);
        alert("Network or fetch error. See console for details.");
        return null;
    }
}
