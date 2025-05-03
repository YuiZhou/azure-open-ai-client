import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { PageLayout } from './components/PageLayout';
import { loginRequest } from './authConfig';
import { callMsGraph } from './graph';
import { ProfileData } from './components/ProfileData';
import OpenAIPage from './components/OpenAIPage';
import OpenAIConfig from './components/OpenAIConfig';
import { isOpenAIConfigValid } from './openaiConfig';

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import './App.css';
import Button from 'react-bootstrap/Button';

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */

const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="profileContent">Welcome {accounts[0].name}</h5>
            {graphData ? (
                <ProfileData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestProfileData}>
                    Request Profile
                </Button>
            )}
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    const [isConfigValid, setIsConfigValid] = useState(false);

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
