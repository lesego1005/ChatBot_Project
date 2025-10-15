console.log("linked!");

const newChatButton = document.getElementById("newChatBtn");
const closeModalButton = document.getElementById("closeModal");
const sendChatButton = document.getElementById("sendBtn");
const userInputField = document.getElementById("userInput");
const chatBox = document.getElementById("chatContainer");
const chatModalPage = document.getElementById("chatModal");
const bodyContent = document.getElementById("the-body");

let allChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
let currentChat = [];

// new chat functonality //
newChatButton.addEventListener("click", function () {
  chatModalPage.style.display = "block";
  chatBox.innerHTML = "";
  currentChat = [];
  addChatCard();
  console.log("New chat started");
});

// modal close //
closeModalButton.addEventListener("click", function () {
  chatModalPage.style.display = "none";
});

// new card rendered for chat history //
function addChatCard() {
  const historyCard = document.createElement("div");
  historyCard.classList.add("text-box");
  const chatNumber = allChats.length + 1;
  historyCard.textContent = `Chat ${chatNumber}`;
  bodyContent.appendChild(historyCard);

  historyCard.addEventListener("click", function () {
    chatModalPage.style.display = "block";
    loadChat(allChats[chatNumber - 1]);
  });
}

// send message //
sendChatButton.addEventListener("click", handleSend);
userInputField.addEventListener("keypress", function (e) {
  if (e.key === "Enter") handleSend();
});

function handleSend() {
  const userMessage = userInputField.value.trim();
  if (!userMessage) return;

  displayMessage(userMessage, "user-message");
  currentChat.push({ sender: "user", text: userMessage });
  userInputField.value = "";
  saveChat();
}

// display the message //
function displayMessage(text, type) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", type);
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// save the chat to local storage //
function saveChat() {
  const existingIndex = allChats.findIndex(
    (chat) => chat.id === currentChat.id
  );

  if (existingIndex !== -1) {
    allChats[existingIndex] = currentChat;
  } else {
    allChats.push([...currentChat]);
  }

  localStorage.setItem("chatHistory", JSON.stringify(allChats));
}

// load the chat //
function loadChat(chatArray) {
  chatBox.innerHTML = "";
  if (!chatArray) return;
  chatArray.forEach((msg) => displayMessage(msg.text, "user-message"));
  currentChat = chatArray;
}

// render the cards on reload of the page //
window.addEventListener("DOMContentLoaded", () => {
  if (allChats.length > 0) {
    allChats.forEach((_, index) => {
      const historyCard = document.createElement("div");
      historyCard.classList.add("text-box");
      historyCard.textContent = `Chat ${index + 1}`;
      bodyContent.appendChild(historyCard);

      historyCard.addEventListener("click", function () {
        chatModalPage.style.display = "block";
        loadChat(allChats[index]);
      });
    });
  }
});
