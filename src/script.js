// Combined dom + script logic (self-contained)
// - Fixes broken allowedTopics array
// - Adds DOM element bindings, displayMessage, and event listeners
// - Keeps getAIResponse/sendMessage logic

// ---- DOM elements & state ----
const chatContainer = document.getElementById("chat-container");
const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const newChatBtn = document.getElementById("new-chat-btn");

let currentChat = [];
let chatCounter = 0;
let chatSessionId = `chat_${Date.now()}_${chatCounter}`;

// ---- Utility: start a new chat ----
function startNewChat() {
  if (chatContainer) chatContainer.innerHTML = "";
  currentChat = [];
  chatCounter++;
  chatSessionId = `chat_${Date.now()}_${chatCounter}`;
  const li = document.createElement("li");
  li.textContent = `Chat ${chatCounter}: New Session`;
  if (chatHistory) chatHistory.appendChild(li);
}

// ---- Restriction: Only coding questions allowed ----
function isCodingRelated(message) {
    const allowedTopics = [
        "code", "coding", "programming", "developer", "software",
        "algorithm", "api", "debug", "bug", "function", "class", "html", "css", "javascript",
        "python", "java", "c#", "c++ , "git", "bash", "powershell"
    ];
    return allowedTopics.some(topic => message.toLowerCase().includes(topic));
}

// ---- API CALL ----
// UPDATED: Now returns the full data object
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

// ---- DOM: display messages ----
function displayMessage(sender, content) {
  if (!chatContainer) return;

  const wrapper = document.createElement("div");
  wrapper.classList.add(sender === "user" ? "user-message" : "ai-message");

  let text = "";
  // ai content may be an object { reply, responseTime } or a plain string
  if (sender === "ai") {
    if (typeof content === "string") {
      text = content;
    } else if (content && typeof content === "object" && "reply" in content) {
      text = content.reply;
      // optionally show responseTime somewhere
    } else {
      text = String(content);
    }
  } else {
    // user
    text = String(content);
  }

  wrapper.textContent = text;
  chatContainer.appendChild(wrapper);
  // keep scroll at bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ---- SEND MESSAGE HANDLER ----
async function sendMessage() {
  if (!userInput) return;
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  displayMessage("user", userMessage);
  currentChat.push({ sender: "user", text: userMessage });
  userInput.value = "";

  // Show typing indicator
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("ai-message", "typing-indicator");
  typingDiv.innerHTML = "<em>AI is typing...</em>";
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Get AI response
  const aiReply = await getAIResponse(userMessage);

  // Remove typing indicator and display AI message
  typingDiv.remove();
  displayMessage("ai", aiReply);
  // store reply text normalized
  if (aiReply && typeof aiReply === "object" && "reply" in aiReply) {
    currentChat.push({ sender: "ai", text: aiReply.reply });
  } else {
    currentChat.push({ sender: "ai", text: String(aiReply) });
  }
}

// ---- Event listeners ----
if (sendBtn) {
  sendBtn.addEventListener("click", sendMessage);
}
if (newChatBtn) {
  newChatBtn.addEventListener("click", startNewChat);
}
if (userInput) {
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

// optional: initialize first chat session
startNewChat();