/**
 * Utility functions for managing saved conversations in localStorage
 */

// Key for localStorage
const SAVED_CONVERSATIONS_KEY = 'azure_openai_saved_conversations';

/**
 * Get all saved conversations from localStorage
 * @returns {Array} Array of saved conversation objects
 */
export const getSavedConversations = () => {
  try {
    const savedData = localStorage.getItem(SAVED_CONVERSATIONS_KEY);
    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error('Error getting saved conversations:', error);
    return [];
  }
};

/**
 * Save a new conversation to localStorage
 * @param {Object} conversation - The conversation to save
 * @param {string} conversation.id - Unique ID for the conversation
 * @param {string} conversation.title - Title for the conversation
 * @param {Array} conversation.messages - Array of message objects
 * @param {Date} conversation.timestamp - When the conversation was saved
 * @returns {boolean} Success status
 */
export const saveConversation = (conversation) => {
  try {
    if (!conversation.id || !conversation.title || !conversation.messages) {
      console.error('Invalid conversation data:', conversation);
      return false;
    }

    const savedConversations = getSavedConversations();
    
    // Check if conversation with this ID already exists
    const existingIndex = savedConversations.findIndex(c => c.id === conversation.id);
    
    if (existingIndex !== -1) {
      // Update existing conversation
      savedConversations[existingIndex] = conversation;
    } else {
      // Add new conversation
      savedConversations.push(conversation);
    }
    
    localStorage.setItem(SAVED_CONVERSATIONS_KEY, JSON.stringify(savedConversations));
    return true;
  } catch (error) {
    console.error('Error saving conversation:', error);
    return false;
  }
};

/**
 * Delete a conversation from localStorage
 * @param {string} conversationId - ID of the conversation to delete
 * @returns {boolean} Success status
 */
export const deleteConversation = (conversationId) => {
  try {
    const savedConversations = getSavedConversations();
    const updatedConversations = savedConversations.filter(c => c.id !== conversationId);
    
    localStorage.setItem(SAVED_CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }
};

/**
 * Get a specific conversation by ID
 * @param {string} conversationId - ID of the conversation to retrieve
 * @returns {Object|null} The conversation object or null if not found
 */
export const getConversationById = (conversationId) => {
  try {
    const savedConversations = getSavedConversations();
    return savedConversations.find(c => c.id === conversationId) || null;
  } catch (error) {
    console.error('Error getting conversation by ID:', error);
    return null;
  }
};

/**
 * Creates a title for a conversation based on the first user message
 * @param {Array} messages - The conversation messages
 * @returns {string} Generated conversation title
 */
export const generateConversationTitle = (messages) => {
  if (!messages || messages.length === 0) {
    return 'New Conversation';
  }
  
  // Find the first user message
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  
  if (!firstUserMessage) {
    return 'New Conversation';
  }
  
  // Use the first 30 characters of the message as the title
  const title = firstUserMessage.content.trim().substring(0, 30);
  return title + (firstUserMessage.content.length > 30 ? '...' : '');
};
