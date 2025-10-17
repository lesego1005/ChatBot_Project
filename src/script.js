// ============================
// CHATBOT SCRIPT
// ============================

document.addEventListener("DOMContentLoaded", () => {

    const newChatBtn = document.getElementById("newChatBtn");
    const chatModal = document.getElementById("chatModal");
    const closeModalButton = document.getElementById("closeModal");
    const chatContainer = document.getElementById("chatContainer");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const bodyContent = document.querySelector(".history-grid");

    let currentChat = [];
    let chatCounter = 0;
    let chatSessionId = null; // Initially null
    let allChats = JSON.parse(localStorage.getItem("chatHistory")) || [];

    // ============================
    // OPEN/CLOSE MODAL
    // ============================
    if (newChatBtn) {
        newChatBtn.addEventListener("click", () => {
            if (chatModal) chatModal.style.display = "flex";
            startNewChat();
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener("click", () => {
            if (chatModal) chatModal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === chatModal) chatModal.style.display = "none";
    });

    // ============================
    // CHAT FUNCTIONS
    // ============================

    function startNewChat() {
        if (!chatContainer) return;
        chatContainer.innerHTML = "";
        currentChat = [];
        chatCounter = allChats.length + 1; // Increment based on existing chats
        chatSessionId = `chat_${Date.now()}_${chatCounter}`;

        const newChatEntry = {
            id: chatSessionId,
            title: `Chat #${chatCounter}`,
            messages: []
        };

        allChats.push(newChatEntry);
        saveAllChats();
        renderChatCards();
    }

    function loadChat(chat) {
        if (!chatContainer) return;
        chatContainer.innerHTML = "";
        currentChat = chat.messages;
        chatSessionId = chat.id;

        currentChat.forEach(msg => displayMessage(msg.sender, { reply: msg.text }));

        if (chatModal) chatModal.style.display = "flex";
    }

    function saveAllChats() {
        localStorage.setItem("chatHistory", JSON.stringify(allChats));
    }

    function renderChatCards() {
        if (!bodyContent) return;

        // Remove old cards
        document.querySelectorAll(".text-box").forEach(el => el.remove());

        allChats.forEach(chat => {
            const card = document.createElement("div");
            card.classList.add("text-box");
            card.textContent = chat.title;
            bodyContent.appendChild(card);

            card.addEventListener("click", () => loadChat(chat));
        });
    }

    // ============================
    // MESSAGE HANDLING
    // ============================
    function displayMessage(sender, content) {
        if (!chatContainer) return;
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender === "user" ? "user-message" : "ai-message");

        let text = content.reply ?? String(content);
        text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
            code = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            return `<pre><code>${code.trim()}</code></pre>`;
        });
        text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        messageDiv.innerHTML = `<strong>${sender === "user" ? "You" : "AI"}:</strong> ${text}`;

        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function sendMessage() {
        if (!userInput) return;
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        displayMessage("user", userMessage);
        currentChat.push({ sender: "user", text: userMessage });
        userInput.value = "";

        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "ai-message", "typing-indicator");
        typingDiv.innerHTML = "<em>AI is typing...</em>";
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        const aiReply = await getAIResponse(userMessage);
        typingDiv.remove();
        displayMessage("ai", aiReply);
        currentChat.push({ sender: "ai", text: aiReply.reply });

        // Update stored chat
        const chatIndex = allChats.findIndex(c => c.id === chatSessionId);
        if (chatIndex > -1) {
            allChats[chatIndex].messages = currentChat;
            saveAllChats();
        }
    }

    async function getAIResponse(userMessage) {
        if (!isCodingRelated(userMessage)) {
            return { reply: "🚫 I'm only able to answer coding-related questions." };
        }
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, sessionId: chatSessionId })
            });
            const data = await response.json();
            return { reply: data.reply ?? "⚠️ No response from AI." };
        } catch {
            return { reply: "⚠️ Error connecting to the AI server." };
        }
    }

  function isCodingRelated(message) {
    const allowedTopics = [
        "code","coding","programming","developer","software","algorithm","api",
        "debug","bug","function","class","html","css","javascript","python",
        "java","c#","c++","git","bash","powershell","sql","ruby","react","scss",
        "bootstrap","c","golang","typescript","swift","php","r"
    ];

    // Convert message to lowercase and remove punctuation for better matching
    const normalizedMsg = message.toLowerCase().replace(/[^\w\s#\+]/g, "");

    // Split message into words for exact keyword match
    const words = normalizedMsg.split(/\s+/);

    // Check if at least one allowed topic is present
    const containsAllowedTopic = words.some(word => allowedTopics.includes(word));

    return containsAllowedTopic;
}


    
    // ============================
    // EVENT LISTENERS
    // ============================
    if (sendBtn) sendBtn.addEventListener("click", sendMessage);
    if (userInput) userInput.addEventListener("keypress", e => {
        if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
    });

    // Render chat cards on load (without creating new chat)
    renderChatCards();

});
