# Code Breaker – Your AI Coding Companion

> *Breaking down code barriers, one line at a time ,k.*

## About Code Breaker

**Code Breaker** is an AI-powered chatbot built to assist developers with **coding help, debugging, syntax explanations, and quick code generation** — all in real time.  
Unlike general-purpose AI tools, Code Breaker is *laser-focused* on programming. It speaks code fluently, explains clearly, and helps both beginners and professionals break through coding roadblocks faster.

**Ask it anything about code**, from:
- HTML, CSS, and JavaScript syntax 
- API integrations and backend logic  
- Code structure, debugging, and best practices 
- Quick explanations for complex snippets  

---

## Screenshots

Here’s a sneak peek at **Code Breaker** in action:

### Home Page showing chat history
![Home Page](<Screenshot 2.jpg>)

### Chat Interface and AI Response 
![Chat Interface](<Screenshot 1.jpg>)

> 📸 *These screenshots showcase Code Breaker’s intuitive UI and AI-driven responses.*

---

## Features

- Real-time coding assistance  
- Syntax explanations for multiple languages  
- Clean and structured code generation  
- Interactive and responsive design  
- Built with scalability and collaboration in mind
- Saving of chat history to local storage to allow for re-render persistance

---

## Tech Stack

| Category | Tools / Technologies |
|-----------|----------------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js, Express |
| **AI / Logic** | Custom-coded AI logic (JavaScript + API) |
| **Version Control** | Git & GitHub |
| **IDE** | Visual Studio Code |

---

## Team Code Breaker

| Name | Role |
|------|------|
| **Thoriso** | JavaScript Developer |
| **Pallo** | API & Server Developer |
| **Lethabo** | HTML, CSS & Documentation |
| **Lesego** | HTML, CSS & Documentation |

> Each team member plays a key role in bringing Code Breaker to life — from crafting logic and styling, to ensuring seamless functionality and top-tier documentation.

---

## Installation & Setup

### Live Deployment
**Code Breaker** is live and accessible here:  
[**Visit Code Breaker on Vercel**](https://chat-bot-project-two.vercel.app/)  

> No setup required — simply open the link and start chatting with the AI assistant.

---

## Model, Prompts & Improvements

### Model Used
We used **Gemini 2.5 Flash** as the core AI model for Code Breaker.  
This model was selected because it provides:
- **Lightning-fast responses** optimized for real-time coding help  
- **Strong contextual understanding** across multiple programming languages  
- **Accurate code generation** with minimal syntax errors  
- **Efficient reasoning** for explaining, refactoring, and debugging code  

**Gemini 2.5 Flash** was the ideal choice for Code Breaker’s focus on **speed, precision, and developer-friendly assistance**.

---

### Prompt Structure

Our prompts were carefully designed to guide the AI toward clear, relevant, and consistent outputs.  
Each prompt includes:

1. **Role Definition** – Instructs the AI to act solely as a *code-focused assistant*  
2. **Context Input** – Captures the user’s exact request, question, or error message  
3. **Instruction Control** – Directs the AI to produce *clean, formatted code* and concise explanations  
4. **Output Formatting** – Ensures all code snippets use proper syntax highlighting and markdown blocks  

**Example Prompt Structure:**

- Direct and Short Prompts: Users typically input concise queries like:
  - basic algorithms
  - basic SQL syntax
  - basic python syntax
  - basic R syntax
- Expecting Educational Output: The prompts are framed to request explanations, examples, or syntax overviews.
- Implicit Context: The AI seems to rely on the context of the prompt and previous chats to determine the type of response (coding help).

---

### Limitations

While **Gemini 2.5 Flash** performs exceptionally well, a few current limitations remain:
- Cannot execute or test code directly — provides only text-based responses  
- Occasional inconsistencies in **explanation depth** based on user phrasing  
- Relies on **prompt clarity** for best performance  

---

### Improvements Made

To enhance Code Breaker’s accuracy and reliability, we implemented several refinements:
- Re-engineered prompt templates to enforce **code-only responses**  
- Filtered outputs to fix **HTML rendering issues** (so headers don’t appear in the webpage UI)  
- Improved follow-up handling for **contextual multi-turn questions**  
- Optimized formatting for **readability and syntax accuracy**  

---

## Vision

To create an open-source, intelligent assistant that empowers coders to learn, create, and solve problems faster — without ever leaving their workspace.

## “Code smarter. Debug faster. Break limits with Code Breaker.”