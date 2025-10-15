// Restriction: Only coding questions allowed
function isCodingRelated(message) {
    const allowedTopics = [
        "code", "coding", "programming", "developer", "software",
        "algorithm", "api", "debug" , "bug" , "function" , "class" , "html", "css", "javascript",
        "python", "java", "c#", "c++
    ];
    return allowedTopics.some(topic => message.toLowerCase().includes(topic));
}

// API CALL
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
