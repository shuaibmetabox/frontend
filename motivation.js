// Function to handle the fetching and updating of the quote
async function updateQuote(topic = null, initialLoad = false) {
    const generateBtn = document.getElementById('generate-btn');
    const quoteEl = document.getElementById('quote');
    const authorEl = document.getElementById('author');
                             //not the 1st time loading and no button
    if (!quoteEl || !authorEl || (!generateBtn && !initialLoad)) {
        console.error("Missing required elements or button not found.");
        return;
    }

    // --- Loading State Setup ---
                         //if theres button,   display button content   else display generate motivation
    const originalBtnText = generateBtn ? generateBtn.innerHTML : "Generate Motivation";
    
    // Set descriptive loading messages
    const topicDisplay = topic ? topic : 'General Inspiration';
    const loadingMessage = initialLoad ? `Loading initial quote...` : `Fetching new quote on ${topicDisplay}...`;

    if (generateBtn) {
        generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;
    }
    
    quoteEl.textContent = loadingMessage;
    authorEl.textContent = "";

    try {
        // --- API Call Setup ---
        let apiUrl = '/api/motivation';
        if (topic) {
            // If a topic is provided by a category button, add it to the query
            apiUrl += `?topic=${encodeURIComponent(topic)}`;
        }
        // If topic is null (main button click), the URL is just /api/motivation

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch motivation');
        }

        const data = await response.json();

        // --- Success State ---
        quoteEl.textContent = `"${data.quote}"`;
        authorEl.textContent = `- ${data.author}`;
        
    } catch (error) {
        console.error('Error:', error);
        // --- Error State ---
        quoteEl.textContent = `"Error: Could not fetch motivation. Try again."`;
        authorEl.textContent = "- The Error Log";
    } finally {
        // --- Restore Button State ---
        if (generateBtn) {
            generateBtn.innerHTML = originalBtnText;
            generateBtn.disabled = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Load: Fetch and display a general quote immediately (topic=null)
    updateQuote(null, true); 

    // 2. Main Button Click: Generate a general quote (topic=null)
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            // Calling updateQuote with no arguments makes topic default to null
            updateQuote(null, false); 
        });
    }
    
    // 3. Category Link Clicks: Generate a specific quote (topic=data-topic)
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const topic = e.target.getAttribute('data-topic');
            if (topic) {
                // Pass the specific topic to updateQuote
                updateQuote(topic, false); 
            }
        });
    });
});