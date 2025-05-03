const GEMINI_API_KEY = window.GEMINI_API_KEY;


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
        ]
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("Full API Response:", JSON.stringify(data, null, 2)); // Log full response

        if (data.error) {
            console.error("API Error:", data.error);
            return null;
        }

        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        console.log("Generated Text:", generatedText); // Log raw text

        if (!generatedText) {
            console.error("Empty novel content received.");
            return null;
        }

        // Extract title with improved regex
        const titleMatch = generatedText.match(/(?:\*\*Title:\*\*|Title:|#\s*)\s*(.+)/i);
        const title = titleMatch ? titleMatch[1].trim() : generatedText.split("\n")[0].trim() || "Untitled Story";
        console.log("Extracted Title:", title); // Log extracted title

        // Extract chapters
        const chapters = generatedText.match(/Chapter \d+:([\s\S]*?)(?=Chapter \d+:|$)/g) || [];

        return {
            title,
            background: `A ${genre} novel inspired by: "${description}"`,
            genre,
            chapters
        };
    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        return null;
    }
}
