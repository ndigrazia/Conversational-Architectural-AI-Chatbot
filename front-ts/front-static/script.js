const chatBody = document.getElementById('chat-body');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let isChatbotTyping = false;
let typingIntervalId = null;
let typingIndicatorMessage = 'Typing';

function displayUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerText = message;
    chatBody.appendChild(userMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function displayChatbotMessage(answer, links) {

    if (isChatbotTyping) {
        // Remove the typing indicator when bot responds
        clearInterval(typingIntervalId);
        const typingIndicator = chatBody.querySelector('.typing-indicator');
        if (typingIndicator) {
        chatBody.removeChild(typingIndicator);
        }
        isChatbotTyping = false;
    } 

    const chatbotMessage = document.createElement('div');
    chatbotMessage.className = 'chatbot-message';
    chatbotMessage.innerText = answer;

    if (links && links.length > 0)
    {
        const title = document.createElement("div");
        title.innerHTML = "<br>References:<br>";

        const link_list = document.createElement('ul');
        links.forEach((item) => {
            let li = document.createElement("li");
            let a = document.createElement("a");
            let txt = item.match(/\[(.*?)\]/)[1];//get only the txt
            let url = item.match(/\((.*?)\)/)[1];//get only the link
            a.innerText = txt;
            a.href = url;
            li.appendChild(a);
            link_list.appendChild(li);
        });
        chatbotMessage.appendChild(title);
        chatbotMessage.appendChild(link_list);
    
    }

    chatBody.appendChild(chatbotMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function displayTypingIndicator() {
    if (!isChatbotTyping) {
        // Create the typing indicator as a chatbot message
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chatbot-message typing-indicator';
        typingIndicator.innerText = typingIndicatorMessage;
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        isChatbotTyping = true;

        // Start the interval to cycle the typing indicator message
        typingIntervalId = setInterval(() => {
        if (typingIndicatorMessage === 'Typing...') {
            typingIndicatorMessage = 'Typing';
        } else {
            typingIndicatorMessage += '.';
        }
        typingIndicator.innerText = typingIndicatorMessage;
        }, 400);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
async function sendMessage() {
    // Ignore empty messages
    const message = userInput.value.trim();
    if (message === '') {
        return;
    }
    displayUserMessage(message);

    userInput.value = '';

    try {
        // Display the typing indicator while waiting for the OpenAI's response
        displayTypingIndicator();

        const response = await fetch('./api/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + getCookie('token')
        },
        body: JSON.stringify({ question: message ,
                                session_id: "1"
                            }),
        });

        if (!response.ok) {
            console.log(response.status);
            if (response.status === 403 || response.status === 401)
                window.location.replace('./');
            throw new Error('Network response was not ok');

        }

        const data = await response.json();
        const answer = data.answer;
        const links = data.link_references;
        displayChatbotMessage(answer,links);
    } catch (error) {
        console.error('Error:', error);
    }
}

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

displayChatbotMessage(`Hi, I'm a Chat Bot. What can I help you with today?`);