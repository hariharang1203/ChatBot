const input_data = document.querySelector('#input');
const send_btn = document.querySelector('#send-btn');
const response_side = document.querySelector('.response-side');
const loader = document.querySelector('.loader-wrap');
const copy_btn = document.querySelector('.copy');

send_btn.addEventListener('click', input_msg);


// copy event
response_side.addEventListener('click', (event) => {
    if (event.target.classList.contains('copy')) {
        const copyText = event.target.previousElementSibling.textContent; // Get the text from the previous sibling (the paragraph <p>)
        navigator.clipboard.writeText(copyText)
            .then(() => {
                alert("Text Copied!");
            })
            .catch(err => {
                console.error('Error copying text: ', err);
            });
    }
});

function input_msg() {
    const user_input = input_data.value.trim();
    console.log(user_input);
    if (user_input === "") return;

    // Create user message element
    const user_msg = document.createElement('div');
    user_msg.classList.add('incoming-wrapper');
    user_msg.innerHTML = `
<div class="incoming-msg">
    <p>${user_input}</p>
    <img src="user-bot.jpg" alt="User image">
</div>`;
    response_side.appendChild(user_msg);
    input_data.value = "";
    user_msg.scrollIntoView({ behavior: "smooth", block: "end" });

    // Show loader
    const load = `
<div class="loader-wrap">
    
     <img src="chat-bot.webp" alt="Bot image" class="load-bot">
     <div class="load-items">
    <div class="load load1"></div>
    <div class="load load2"></div>
    <div class="load load3"></div>
     </div>
</div>`;
    const loaderWrapper = document.createElement('div');
    loaderWrapper.innerHTML = load;
    loaderWrapper.classList.add('outgoing-wrapper');
    response_side.appendChild(loaderWrapper);
    loaderWrapper.scrollIntoView({ behavior: "smooth", block: "end" });


    fetchResponse(user_input);
}
// Fetch the response from the API
function fetchResponse(user_input) {
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC9g18yJlweXI2wJOvatSFmDhVs_8Pedkk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: user_input
                        }
                    ]
                }
            ]
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            // Hide loader
            console.log(data)
            console.log(data?.candidates?.[0]?.content?.parts?.[0]?.text);
            const loaderWrapper = document.querySelector('.loader-wrap');
            if (loaderWrapper) loaderWrapper.remove();

            // Check if the response format is correct
            const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"; // Corrected path
            const bot_msg = document.createElement('div');
            bot_msg.classList.add('outgoing-wrapper');
            bot_msg.innerHTML = `
    <div class="outgoing-msg">
        <img src="chat-bot.webp" alt="Bot image">
        <p>${botResponse}</p>
         <span class="material-symbols-outlined copy">
                content_copy
                </span>
    </div>`;
            response_side.appendChild(bot_msg);
            bot_msg.scrollIntoView({ behavior: "smooth", block: "end" });


        })
        .catch(error => {
            console.error('Error:', error);
            const loaderWrapper = document.querySelector('.loader-wrap');
            if (loaderWrapper) loaderWrapper.remove();

            const bot_msg = document.createElement('div');
            bot_msg.classList.add('outgoing-wrapper');
            bot_msg.innerHTML = `
    <div class="outgoing-msg">
        <img src="chat-bot.webp" alt="Bot image">
        <p>Error: Could not fetch response</p>
         <span class="material-symbols-outlined">
                content_copy
                </span>
    </div>`;
            response_side.appendChild(bot_msg);
            bot_msg.scrollIntoView({ behavior: "smooth", block: "end" });
        });
}  