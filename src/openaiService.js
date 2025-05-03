/**
 * Service to interact with Azure OpenAI API
 */
import { AzureOpenAI } from "openai";
import { getOpenAIConfig } from "./openaiConfig";
import { openaiConfig } from "./authConfig";

// Cache for the OpenAI client instance
let openAIClientInstance = null;
// Cache for the current MSAL instance
let msalInstance = null;

/**
 * Initializes the OpenAI client with MSAL instance for token acquisition
 * @param {object} instance - The MSAL instance
 * @param {object} account - The user account
 * @returns {Promise<AzureOpenAI>} The OpenAI client instance
 */
export const initializeOpenAIClient = async (instance, account) => {
    try {
        const { endpoint, modelName } = getOpenAIConfig();
        
        // Save MSAL instance for token refresh
        msalInstance = instance;
        
        // Verify the configuration is valid
        if (!endpoint || !modelName) {
            throw new Error("Invalid OpenAI configuration: endpoint and modelName are required");
        }
        
        // Create client with MSAL token provider
        openAIClientInstance = new AzureOpenAI({
            endpoint: endpoint,
            modelName: modelName,
            azureADTokenProvider: 
                async () => {
                    // Use the MSAL instance to acquire a token silently
                    const tokenResponse = await msalInstance.acquireTokenSilent({
                        scopes: openaiConfig.scopes,
                        account: account
                    });
                    return tokenResponse.accessToken;
                
            },
            apiVersion: "2025-01-01-preview",
            dangerouslyAllowBrowser: true, // Allow browser usage (for development purposes)
        });
        
        return openAIClientInstance;
    } catch (error) {
        console.error("Error initializing OpenAI client:", error);
        throw error; // Re-throw to allow proper error handling
    }
};

/**
 * Gets the OpenAI client, initializing it if necessary
 * @param {object} instance - The MSAL instance (only needed for initialization)
 * @param {object} account - The user account (only needed for initialization)
 * @returns {Promise<AzureOpenAI>} The OpenAI client instance
 */
export const getOpenAIClient = async (instance, account) => {
    try {
        // If client doesn't exist yet or settings have changed, initialize it
        if (!openAIClientInstance && instance && account) {
            return await initializeOpenAIClient(instance, account);
        }
        return openAIClientInstance;
    } catch (error) {
        console.error("Error getting OpenAI client:", error);
        throw error;
    }
};

/**
 * Sends a message to Azure OpenAI and gets the response
 * @param {object} instance - The MSAL instance
 * @param {object} account - The user account
 * @param {Array} messages - The conversation history
 * @returns {Promise<Object>} The response from OpenAI
 */
export const sendMessageToOpenAI = async (instance, account, messages) => {
    try {
        // Get or initialize the OpenAI client
        const client = await getOpenAIClient(instance, account);
        
        if (!client) {
            throw new Error("OpenAI client not initialized. Please check your configuration.");
        }
        
        const { modelName } = getOpenAIConfig();
        
        console.log("Sending request to OpenAI with model:", modelName);
        
        const response = await client.chat.completions.create({
            messages: messages, 
            max_tokens: 800,
            model: modelName,
            temperature: 0.7,
        });
        
        if (response && response.choices && response.choices.length > 0) {
            return {
                message: response.choices[0].message,
                usage: response.usage,
                success: true
            };
        } else {
            throw new Error("No response from OpenAI");
        }
    } catch (error) {
        console.error("Error calling Azure OpenAI:", error);
        return {
            message: null,
            error: error.message || "Failed to get response from Azure OpenAI",
            success: false
        };
    }
};

/**
 * Resets the OpenAI client instance (call this when settings change)
 */
export const resetOpenAIClient = () => {
    openAIClientInstance = null;
};

/**
 * Formats a conversation for sending to OpenAI
 * @param {Array} conversation - Array of message objects
 * @returns {Array} Formatted conversation for OpenAI API
 */
export const formatConversationForOpenAI = (conversation) => {
    return conversation.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
};
