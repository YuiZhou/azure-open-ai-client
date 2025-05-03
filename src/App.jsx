import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { PageLayout } from './components/PageLayout';
import OpenAIPage from './components/OpenAIPage';
import OpenAIConfig from './components/OpenAIConfig';

import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import './App.css';

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    const [setIsConfigValid] = useState(false);

    const handleConfigChange = (isValid) => {
        setIsConfigValid(isValid);
    };

    return (
        <div className="App">
            <AuthenticatedTemplate>
                <OpenAIConfig onConfigChange={handleConfigChange} />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to configure Azure OpenAI settings.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [chatKey, setChatKey] = useState(Date.now()); // Add a key for the ChatInterface

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        // Generate a new key whenever the conversation changes, including when starting a new chat
        setChatKey(Date.now());
    };

    return (
        <Router>
            <PageLayout onSelectConversation={handleSelectConversation}>
                <Routes>
                    <Route path="/" element={<OpenAIPage 
                        selectedConversation={selectedConversation} 
                        chatKey={chatKey} 
                    />} />
                    <Route path="/openai" element={<MainContent />} />
                </Routes>
            </PageLayout>
        </Router>
    );
}
