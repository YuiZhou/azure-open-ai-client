import React, { useState, useRef, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { sendMessageToOpenAI, formatConversationForOpenAI, initializeOpenAIClient } from "../openaiService";
import "./ChatInterface.css";

const ChatInterface = () => {
    const { instance, accounts } = useMsal();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);    // Initialize OpenAI client when component mounts
    useEffect(() => {
        const initClient = async () => {
            if (instance && accounts && accounts.length > 0) {
                try {
                    setIsLoading(true);
                    await initializeOpenAIClient(instance, accounts[0]);
                    setError(null);
                } catch (err) {
                    console.error("Failed to initialize OpenAI client:", err);
                    setError("Failed to initialize OpenAI client. Please check your configuration.");
                } finally {
                    setIsLoading(false);
                }
            }
        };
        
        initClient();
    }, [instance, accounts]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus the input field when component mounts
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message to chat
        const userMessage = { role: "user", content: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput("");
        setIsLoading(true);
        setError(null);

        try {
            // Format conversation history for OpenAI
            const conversationHistory = formatConversationForOpenAI([
                ...messages, 
                userMessage
            ]);
            
            console.log("Sending conversation to OpenAI:", conversationHistory);
            
            // Send message to OpenAI using the cached client
            const response = await sendMessageToOpenAI(
                instance,
                accounts[0],
                conversationHistory
            );

            if (response.success && response.message) {
                // Add assistant response to chat
                setMessages(prevMessages => [
                    ...prevMessages, 
                    { 
                        role: "assistant", 
                        content: response.message.content
                    }
                ]);
            } else {
                // Add error message
                setError(response.error || "Failed to get response");
                setMessages(prevMessages => [
                    ...prevMessages, 
                    { 
                        role: "assistant", 
                        content: `Error: ${response.error || "Something went wrong"}`,
                        isError: true 
                    }
                ]);
            }
        } catch (error) {
            console.error("Error in chat:", error);
            setError(error.message || "An unexpected error occurred");
            // Add error message
            setMessages(prevMessages => [
                ...prevMessages, 
                { 
                    role: "assistant", 
                    content: `Error: ${error.message || "Something went wrong"}`,
                    isError: true 
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };return (
        <div className="chat-container">
            {error && (
                <div className="chat-error-banner">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}
            
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <p>Start a conversation with Azure OpenAI</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`message ${message.role === "user" ? "user-message" : "assistant-message"} ${message.isError ? "error-message" : ""}`}
                        >
                            <div className="message-bubble">
                                <p>{message.content}</p>
                            </div>
                            <div className="message-info">
                                {message.role === "user" ? "You" : "Assistant"}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="message assistant-message">
                        <div className="message-bubble loading">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div className="message-info">Assistant</div>
                    </div>
                )}
                <div ref={messagesEndRef}></div>
            </div>

            <form className="chat-input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    ref={inputRef}
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()}>
                    {isLoading ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
