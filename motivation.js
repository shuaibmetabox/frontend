// Function to handle the fetching and updating of the quote
async function updateQuote(topic = null, initialLoad = false) {
    const generateBtn = document.getElementById('generate-btn');
    const quoteEl = document.getElementById('quote');
    const authorEl = document.getElementById('author');
    //if theres no quote or no authot or (not the 1st time loading and no button)
    if (!quoteEl || !authorEl || (!generateBtn && !initialLoad)) {
        console.error("Missing required elements or button not found.");
        return;
    }

    // --- LOADING STATE SETUP ---
            //if theres button,   display original button content   else display generate motivation
    const originalBtnText = generateBtn ? generateBtn.innerHTML : "Generate Motivation";
            //if theres topic,   display topic   else display general(no topic)
    const topicDisplay = topic ? topic : 'General Inspiration';
            //if just opened browser, (loading intial quote) else ...
    const loadingMessage = initialLoad ? `Loading initial quote...` : `Fetching new quote on ${topicDisplay}...`;

    // if there's button, add the loading icon in button
    if (generateBtn) {
        generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true; //disable btn to avoid multiple clicks
    }
    
    quoteEl.textContent = loadingMessage; //load this in quote
    authorEl.textContent = "";

    try {
        // --- API Call Setup ---   //the link to our backend
        let apiUrl ='https://backendd-cgl9.onrender.com/api/motivation';
        if (topic) {
            // If a topic is provided by a category button, add it to the query(?topic=success..etc)
            apiUrl += `?topic=${encodeURIComponent(topic)}`;
        }
        // If topic is null (main button click), the URL is just the original

        const response = await fetch(apiUrl); //fetch response from url (response in json)
        
        if (!response.ok) {  //if response is not ok, get the error in json and throw
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch motivation');
        }

        const data = await response.json(); //get the data in a javascript object

        // --- Success State ---
        quoteEl.textContent = `"${data.quote}"`; //replace quote and author
        authorEl.textContent = `- ${data.author}`;
        
    } catch (error) { //catch any error and provide error message if any error
        console.error('Error:', error);
        // --- Error State ---
        quoteEl.textContent = `"Error: Could not fetch motivation. Try again."`;
        authorEl.textContent = "- The Error Log";
    } finally {
        // --- Restore Button State ---
        if (generateBtn) {
            generateBtn.innerHTML = originalBtnText;
            generateBtn.disabled = false;
        } //then restore the original text even if it failed
    }
}

document.addEventListener('DOMContentLoaded', () => { //runs when page has fully loaded
    // 1. Initial Load: Fetch and display a general quote immediately (topic=null)
    updateQuote(null, true); //calls function

    // 2. Main Button Click: Generate a general quote (topic=null)
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', (e) => { //e is the event object
            e.preventDefault();   //stops default browser action (eg when we click submit button, it submits it by default, this is prevented to be handled manually )
            // Calling updateQuote with no arguments makes topic default to null
            updateQuote(null, false);  //calls function for general
        });
    }
    
    // 3. Category Link Clicks: Generate a specific quote (topic=data-topic)
    const categoryLinks = document.querySelectorAll('.category-link'); // gets all category elements
    categoryLinks.forEach(link => {  //for each category, when clicked, get the category and pass it to the function
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const topic = e.target.getAttribute('data-topic'); //(data-topic = success in html),it gets that data topic
            if (topic) {
                // Pass the specific topic to updateQuote
                updateQuote(topic, false); 
            }
        });
    });
});