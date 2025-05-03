import React from 'react';
import { Link } from 'react-router-dom';
import './SideMenu.css';

/**
 * Renders a side menu that can be toggled
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onClose - Function to call when closing the menu
 */
const SideMenu = ({ isOpen, onClose }) => {
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
            <Link to="/" className="side-menu-link" onClick={onClose}>Home</Link>
            <Link to="/openai" className="side-menu-link" onClick={onClose}>Azure OpenAI Chat</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
