console.log("linked!");

const newChatButton = document.getElementById("newChatBtn");
const closeModalButton = document.getElementById("closeModal");
const sendChatButton = document.getElementById("sendBtn");
const userInputField = document.getElementById("userInput");
const chatBox = document.getElementById("chatContainer");
const chatModalPage = document.getElementById("chatModal");
const bodyContent = document.getElementById("the-body");

let allChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
let currentChat = null;

// === Start New Chat ===
newChatButton.addEventListener("click", function () {
  currentChat = {
    id: Date.now(),
    title: `Chat ${allChats.length + 1}`,
    messages: [],
  };

  allChats.push(currentChat);
  saveAllChats();

  chatBox.innerHTML = "";
  renderChatCards();
  chatModalPage.style.display = "block";
});

// === Close Modal ===
closeModalButton.addEventListener("click", function () {
  chatModalPage.style.display = "none";
});

// === Render Chat Cards ===
function renderChatCards() {
  document.querySelectorAll(".text-box").forEach((el) => el.remove());

  allChats.forEach((chat) => {
    const historyCard = document.createElement("div");
    historyCard.classList.add("text-box");
    historyCard.textContent = chat.title;
    bodyContent.appendChild(historyCard);

    // Open existing chat
    historyCard.addEventListener("click", function () {
      currentChat = chat;
      chatModalPage.style.display = "block";
      loadChat(chat);
    });
  });
}

// === Send Message ===
sendChatButton.addEventListener("click", handleSend);
userInputField.addEventListener("keypress", function (e) {
  if (e.key === "Enter") handleSend();
});

function handleSend() {
  const userMessage = userInputField.value.trim();
  if (!userMessage || !currentChat) return;

  displayMessage(userMessage, "user-message");
  currentChat.messages.push({ sender: "user", text: userMessage });

  // If first message, rename chat title
  if (currentChat.messages.length === 1) {
    currentChat.title =
      userMessage.slice(0, 25) + (userMessage.length > 25 ? "..." : "");
    renderChatCards();
  }

  userInputField.value = "";
  saveAllChats();
}

// === Display Message ===
function displayMessage(text, type) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", type);
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// === Load Chat Messages ===
function loadChat(chat) {
  chatBox.innerHTML = "";
  chat.messages.forEach((msg) => {
    displayMessage(
      msg.text,
      msg.sender === "user" ? "user-message" : "ai-message"
    );
  });
}

// === Save All Chats to localStorage ===
function saveAllChats() {
  localStorage.setItem("chatHistory", JSON.stringify(allChats));
}

// === Render Cards on Page Load ===
window.addEventListener("DOMContentLoaded", renderChatCards);
