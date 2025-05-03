import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSavedConversations, deleteConversation } from '../conversationStorage';
import './SideMenu.css';

/**
 * Renders a side menu that can be toggled
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onClose - Function to call when closing the menu
 * @param {Function} props.onSelectConversation - Function to call when selecting a saved conversation
 */
const SideMenu = ({ isOpen, onClose, onSelectConversation }) => {
  const [savedConversations, setSavedConversations] = useState([]);
  const navigate = useNavigate();

  // Load saved conversations when the menu opens
  useEffect(() => {
    if (isOpen) {
      loadSavedConversations();
    }
  }, [isOpen]);

  const loadSavedConversations = () => {
    const conversations = getSavedConversations();
    // Sort by most recent first
    conversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setSavedConversations(conversations);
  };

  const handleSelectConversation = (conversation) => {
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
    navigate('/openai');
    onClose();
  };

  const handleNewChat = () => {
    // Pass null to clear the selected conversation
    if (onSelectConversation) {
      onSelectConversation(null);
    }
    navigate('/openai');
    onClose();
  };

  const handleDeleteConversation = (e, conversationId) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    deleteConversation(conversationId);
    loadSavedConversations();
  };

  return (
    <>
      <div className={`side-menu-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="side-menu-header">
          <button className="side-menu-close" onClick={onClose}>×</button>
          <h3>Menu</h3>
        </div>
        <div className="side-menu-content">
          <nav className="side-menu-nav">
            <Link to="/" className="side-menu-link" onClick={onClose}>Settings</Link>
            <div className="side-menu-link new-chat" onClick={handleNewChat}>
              <span className="new-chat-icon">New Chat</span>
            </div>
            
            {savedConversations.length > 0 && (
              <div className="saved-conversations-section">
                <h4 className="section-title">Saved Conversations</h4>
                <div className="saved-conversations-list">
                  {savedConversations.map(conversation => (
                    <div 
                      key={conversation.id} 
                      className="saved-conversation-item"
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="conversation-title">{conversation.title}</div>
                      <div className="conversation-timestamp">
                        {new Date(conversation.timestamp).toLocaleDateString()}
                      </div>
                      <button 
                        className="delete-conversation-btn"
                        onClick={(e) => handleDeleteConversation(e, conversation.id)}
                        title="Delete conversation"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
