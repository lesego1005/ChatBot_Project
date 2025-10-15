// server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
// Use of the official Google GenAI SDK for chat management
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize the GoogleGenAI Client. 
// It automatically reads GEMINI_API_KEY from the environment.
const ai = new GoogleGenAI({});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎯 Chat Sessions Map: Stores active conversations by sessionId
const chatSessions = new Map();

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files (HTML, CSS, JS) from the 'src' directory
app.use(express.static(path.join(__dirname, "src")));

// Gemini Chat API Endpoint
app.post("/api/chat", async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({ error: "Missing message or sessionId" });
        }

        let chat = chatSessions.get(sessionId);

        // Check for existing session. If none, start a new chat.
        if (!chat) {
            chat = ai.chats.create({
                model: 'gemini-2.5-flash', 
                config: {
                    // System instruction defines the AI's role and constraints
                    systemInstruction: "You are an expert Code Assistant. Your primary function is to answer programming and coding-related questions. Keep your responses concise, helpful, and formatted clearly using markdown code blocks.",
                }
            });
            chatSessions.set(sessionId, chat);
            console.log(`New chat session created: ${sessionId}`);
        }

        // Send the message through the chat object to maintain history
        const result = await chat.sendMessage({ message: message });
        const aiReply = result.text;

        res.json({ reply: aiReply });

    } catch (error) {
        console.error("❌ Server error during chat:", error);
        // Return the specific error message the frontend expects
        res.status(500).json({ reply: "⚠️ Error connecting to the AI server." }); 
    }
});

// Serve index.html
app.get("/", (req, res) => {
    // Serves the HTML file when the root URL is accessed
    res.sendFile(path.join(__dirname, "src", "index.html"));
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
