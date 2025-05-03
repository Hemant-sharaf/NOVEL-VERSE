document.getElementById("novelForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const description = encodeURIComponent(document.getElementById("description").value);
    const genre = encodeURIComponent(document.getElementById("genre").value);
    const numChapters = document.getElementById("numChapters").value;
    
    if (!description || numChapters < 1) {
        alert("Please enter a valid description and chapter count.");
        return;
    }

    // Corrected path (without /public/)
    window.location.href = `/novel.html?description=${description}&genre=${genre}&numChapters=${numChapters}`;
});
