import React, { useState, useEffect } from "react";
import { 
    AuthenticatedTemplate, 
    UnauthenticatedTemplate, 
    useMsal,
    useIsAuthenticated
} from "@azure/msal-react";
import { isOpenAIConfigValid, getOpenAIConfig } from "../openaiConfig";
import { openaiConfig } from "../authConfig";
import ChatInterface from "./ChatInterface";
import "./OpenAIPage.css";

const OpenAIPage = ({ selectedConversation, chatKey }) => {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [isConfigValid, setIsConfigValid] = useState(false);
    const [hasAzureOpenAIScope, setHasAzureOpenAIScope] = useState(false);
    const [isCheckingScope, setIsCheckingScope] = useState(true);

    // Check if config is valid on component mount and when it changes
    useEffect(() => {
        setIsConfigValid(isOpenAIConfigValid(getOpenAIConfig()));
    }, []);

    // Handle login with Azure OpenAI scope
    const handleLogin = async () => {
        try {
            const loginResponse = await instance.loginPopup({
                scopes: openaiConfig.scopes
            });
            setHasAzureOpenAIScope(true);
            console.log("Login successful with Azure OpenAI scope", loginResponse);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    // Check if the user has Azure OpenAI scope
    useEffect(() => {
        const checkScope = async () => {
            if (isAuthenticated && accounts.length > 0) {
                setIsCheckingScope(true);
                try {
                    const tokenResponse = await instance.acquireTokenSilent({
                        scopes: openaiConfig.scopes,
                        account: accounts[0]
                    });
                    setHasAzureOpenAIScope(!!tokenResponse);
                } catch (error) {
                    console.log("Need to request Azure OpenAI scope:", error);
                    setHasAzureOpenAIScope(false);
                } finally {
                    setIsCheckingScope(false);
                }
            } else {
                setIsCheckingScope(false);
            }
        };
        
        checkScope();
    }, [instance, accounts, isAuthenticated]);
    
    // Handler for config changes
    const handleConfigChange = (isValid) => {
        setIsConfigValid(isValid);
    };

    return (
        <div className="openai-page">
            <AuthenticatedTemplate>
                {isCheckingScope ? (
                    <div className="openai-message loading-message">
                        <p>Checking Azure OpenAI permissions...</p>
                    </div>                ) : isConfigValid ? (
                    hasAzureOpenAIScope ? (
                        <ChatInterface 
                            key={chatKey} 
                            savedConversation={selectedConversation} 
                        />
                    ) : (
                        <div className="openai-auth-container">
                            <p>You need to grant permission to access Azure OpenAI Services.</p>
                            <button className="auth-button" onClick={handleLogin}>
                                Grant Permission
                            </button>
                        </div>
                    )
                ) : (
                    <div className="openai-message">
                        <p>Please complete the Azure OpenAI configuration in the settings page to continue.</p>
                        <p className="config-tip">You'll need your Azure OpenAI endpoint and model/deployment name.</p>
                    </div>
                )}
            </AuthenticatedTemplate>
            
            <UnauthenticatedTemplate>                <div className="openai-auth-container">
                    <p>You need to sign in to use Azure OpenAI Chat.</p>
                    <p>This application integrates with your Azure OpenAI service using Microsoft Entra ID authentication.</p>
                </div>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default OpenAIPage;
