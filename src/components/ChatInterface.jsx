import React, { useState, useRef, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import ReactMarkdown from "react-markdown";
import { v4 } from 'uuid';
import { sendMessageToOpenAI, formatConversationForOpenAI, initializeOpenAIClient } from "../openaiService";
import { saveConversation, generateConversationTitle } from "../conversationStorage";
import "./ChatInterface.css";

const ChatInterface = ({ savedConversation }) => {
    const { instance, accounts } = useMsal();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);    // Helper function to format timestamp in mm-dd HH:MM format
    const formatTimestamp = (date) => {
        const pad = (num) => (num < 10 ? '0' + num : num);
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${month}/${day} ${hours}:${minutes}`;
    };
    
    // Initialize OpenAI client when component mounts
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
    
    // Automatically save conversation whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            saveCurrentConversation();
        }
    }, [messages]);    // Handle loading a saved conversation
    useEffect(() => {
        if (savedConversation) {
            setMessages(savedConversation.messages);
            setConversationId(savedConversation.id);
        } else {
            // Generate a new conversation ID if this is a new conversation
            setConversationId(v4());
            setMessages([]);
        }
    }, [savedConversation]);

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
    };    // Save the current conversation to localStorage
    const saveCurrentConversation = () => {
        if (!messages || messages.length === 0) return;
        
        const title = generateConversationTitle(messages);
        const conversation = {
            id: conversationId,
            title: title,
            messages: messages,
            timestamp: new Date().toISOString()
        };
        
        // Save conversation without triggering a state update
        saveConversation(conversation);
    };const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!input.trim()) return;

        // Add user message to chat with timestamp
        const userMessage = { 
            role: "user", 
            content: input, 
            timestamp: formatTimestamp(new Date())
        };
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
                // Add assistant response to chat with timestamp
                const newMessages = [
                    ...messages,
                    userMessage,
                    { 
                        role: "assistant", 
                        content: response.message.content,
                        timestamp: formatTimestamp(new Date())
                    }                ];
                
                setMessages(newMessages);
            } else {
                // Add error message with timestamp
                setError(response.error || "Failed to get response");
                setMessages(prevMessages => [
                    ...prevMessages, 
                    { 
                        role: "assistant", 
                        content: `Error: ${response.error || "Something went wrong"}`,
                        isError: true,
                        timestamp: formatTimestamp(new Date())
                    }
                ]);
            }        } catch (error) {
            console.error("Error in chat:", error);
            setError(error.message || "An unexpected error occurred");
            // Add error message with timestamp
            setMessages(prevMessages => [
                ...prevMessages, 
                { 
                    role: "assistant", 
                    content: `Error: ${error.message || "Something went wrong"}`,
                    isError: true,
                    timestamp: formatTimestamp(new Date())
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
            <div className="chat-header">
                <h3>{savedConversation?.title || "New Chat"}</h3>
            </div>
            
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <p>Start a conversation with Azure OpenAI</p>
                    </div>
                ) : (                    messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`message ${message.role === "user" ? "user-message" : "assistant-message"} ${message.isError ? "error-message" : ""}`}
                        >
                            <div className="message-bubble">
                                {message.role === "assistant" ? (
                                    <div className="markdown-content">
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p>{message.content}</p>                                )}
                            </div>
                            <div className="message-info">
                                {message.role === "user" ? "You" : "Assistant"} • {message.timestamp || formatTimestamp(new Date())}
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
                                <span></span>                            </div>
                        </div>
                        <div className="message-info">Assistant • {formatTimestamp(new Date())}</div>
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
