window.GEMINI_API_KEY = "AIzaSyBNNPgrwf2Lwn1uMT2CawVHe22DG5QUDUc";
import { generateNovel } from "./geminiAPI.js";


// Function to get query parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        description: params.get("description"),
        genre: params.get("genre") || "General", // Use "General" as fallback
        numChapters: parseInt(params.get("numChapters")) || 1,
    };
}

// Function to display the novel
async function displayNovel() {
    const { description, genre, numChapters } = getQueryParams();
    if (!description) {
        document.getElementById("title").textContent = "Invalid request.";
        return;
    }

    try {
        const novelData = await generateNovel(description, genre, numChapters);
        
        if (!novelData) {
            document.getElementById("title").textContent = "Failed to generate novel.";
            return;
        }

        // Remove cover image reference
        // document.getElementById("cover").src = novelData.cover; (REMOVE THIS)

        document.getElementById("title").textContent = novelData.title || "Generated Story";
        document.getElementById("background").textContent = `Genre: ${novelData.genre}\n\n${novelData.background}`;
        
        const chaptersContainer = document.getElementById("chapters");
        chaptersContainer.innerHTML = "";
        novelData.chapters.forEach((chapter, index) => {
            const chapterElement = document.createElement("div");
            chapterElement.classList.add("chapter");
            chapterElement.innerHTML = `<h2>Chapter ${index + 1}</h2><p>${chapter}</p>`;
            chaptersContainer.appendChild(chapterElement);
        });
    } catch (error) {
        console.error("Error generating novel:", error);
        document.getElementById("title").textContent = "Failed to generate novel.";
    }
}

// Call function on page load
displayNovel();
