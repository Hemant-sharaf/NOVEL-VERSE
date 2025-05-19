const GEMINI_API_KEY = window.GEMINI_API_KEY;

// Rate limiting constants. Adjust based on Gemini API docs.
const REQUESTS_PER_MINUTE = 5; // Example: Adjust this value
const TIME_WINDOW_MS = 60000; // 60 seconds in milliseconds

let requestQueue = [];
let lastRequestTime = 0;

async function throttledFetch(url, options) {
    return new Promise((resolve, reject) => {
        requestQueue.push({
            url,
            options,
            resolve,
            reject
        });
        processQueue();
    });
}

async function processQueue() {
    if (requestQueue.length === 0) {
        return;
    }

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < TIME_WINDOW_MS / REQUESTS_PER_MINUTE) {
        const delay = TIME_WINDOW_MS / REQUESTS_PER_MINUTE - timeSinceLastRequest;
        setTimeout(processQueue, delay); // Schedule next request
        return;
    }

    const { url, options, resolve, reject } = requestQueue.shift();
    lastRequestTime = Date.now();

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            // Handle non-200 status codes more gracefully
            console.error(`API Error: Status ${response.status}`);
            let errorData;
            try {
                 errorData = await response.json();  // Try to parse JSON error
                 console.error("Error Data:", errorData);
            } catch (parseError) {
                console.error("Failed to parse error JSON:", parseError);
                errorData = `Status: ${response.status} - Unable to parse error response`;
            }
            reject(new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`));  // Reject promise for errors
            return;
        }

        const data = await response.json();
        resolve(data); // Resolve promise with data

    } catch (error) {
        console.error("Fetch Error:", error);
        reject(error); // Reject promise for fetch errors
    }

    // Schedule the next request
    setTimeout(processQueue, 0);  // Process next immediately if no throttling needed.
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
        ]
    };

    try {
        const responseData = await throttledFetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });


        console.log("Full API Response:", JSON.stringify(responseData, null, 2)); // Log full 
         
         if (responseData.error) {
            console.error("API Error:", responseData.error);
            return null;
        }

        const generatedText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
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
