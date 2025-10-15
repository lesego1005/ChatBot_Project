// script.js (Updated for Response Time)

// ============================
// ELEMENT SELECTORS
// ============================
const newChatBtn = document.getElementById("newChatBtn");
const chatModal = document.getElementById("chatModal");
const closeModal = document.getElementById("closeModal");
const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatHistory = document.getElementById("chatHistory");

// ============================
// CHAT STATE
// ============================
let currentChat = [];
let chatSessionId = null;
let chatCounter = chatHistory.children.length;

// ============================
// OPEN/CLOSE MODAL
// ============================
newChatBtn.addEventListener("click", () => {
    chatModal.style.display = "block";
    startNewChat();
});

closeModal.addEventListener("click", () => {
    chatModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === chatModal) chatModal.style.display = "none";
});

// ============================
// UTILITY FUNCTIONS
// ============================
/**
 * Displays a message in the chat container.
 * @param {string} sender - 'user' or 'ai'
 * @param {string} text - The message content.
 * @param {string | null} [responseTime=null] - The AI response time in ms. 🎯 UPDATED: Added responseTime parameter
 */
function displayMessage(sender, text, responseTime = null) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "ai-message");

    let content = `<strong>${sender === "user" ? "You" : "AI"}:</strong> ${text}`;
    
    // 🎯 NEW: Add response time display for AI messages
    if (responseTime && sender === "ai" && responseTime !== "N/A") {
        content += `<br><small class="response-time">(Response Time: ${responseTime} ms)</small>`;
    }
    
    messageDiv.innerHTML = content;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function startNewChat() {
    chatContainer.innerHTML = "";
    currentChat = [];
    chatCounter++;
    chatSessionId = `chat_${Date.now()}_${chatCounter}`;
    const li = document.createElement("li");
    li.textContent = `Chat ${chatCounter}: New Session`;
    chatHistory.appendChild(li);
}

// Restriction: Only coding questions allowed
function isCodingRelated(message) {
    const allowedTopics = [
        "code", "coding", "programming", "developer", "software",
        "algorithm", "html", "css", "javascript", "python", "java", "c#", "c++"
    ];
    return allowedTopics.some(topic => message.toLowerCase().includes(topic));
}

// ============================
// API CALL
// ============================
// 🎯 UPDATED: Now returns the full data object { reply, responseTime }
async function getAIResponse(userMessage) {
    try {
        if (!isCodingRelated(userMessage)) {
            // Return error object matching expected successful shape
            return { reply: "🚫 I'm only able to answer coding-related questions. Please ask a programming question.", responseTime: "0.00" };
        }

        const payload = {
            message: userMessage,
            sessionId: chatSessionId
        };

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const data = await response.json();
        
        // 🎯 Return the full data object, including 'reply' and 'responseTime'
        return data; 

    } catch (error) {
        console.error("❌ Error:", error);
        // Return structured error object for consistent handling in sendMessage
        return { reply: "⚠️ Error connecting to the AI server.", responseTime: "N/A" };
    }
}

// ============================
// SEND MESSAGE HANDLER
// ============================
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // We do not pass responseTime for user messages
    displayMessage("user", userMessage);
    currentChat.push({ sender: "user", text: userMessage });
    userInput.value = "";

    // Show typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("ai-message");
    typingDiv.innerHTML = "<em>AI is typing...</em>";
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // 🎯 UPDATED: Get the full data object (reply, time)
    const aiData = await getAIResponse(userMessage);

    // Remove typing indicator
    typingDiv.remove();
    
    const aiReply = aiData.reply;
    const time = aiData.responseTime; // Extract the new responseTime

    // 🎯 Pass the reply AND the response time to displayMessage
    displayMessage("ai", aiReply, time); 
    currentChat.push({ sender: "ai", text: aiReply });
}

// ============================
// EVENT LISTENERS
// ============================
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Initialize first chat session
startNewChat();