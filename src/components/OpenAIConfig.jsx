import React, { useState, useEffect } from "react";
import { saveOpenAIConfig, getOpenAIConfig, isOpenAIConfigValid } from "../openaiConfig";
import "./OpenAIConfig.css";

const OpenAIConfig = ({ onConfigChange }) => {
    const [config, setConfig] = useState(getOpenAIConfig());
    const [isConfigValid, setIsConfigValid] = useState(false);

    useEffect(() => {
        // Check if config is valid and notify parent component
        const valid = isOpenAIConfigValid(config);
        setIsConfigValid(valid);
        if (onConfigChange) {
            onConfigChange(valid);
        }
    }, [config, onConfigChange]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedConfig = {
            ...config,
            [name]: value
        };
        setConfig(updatedConfig);
        saveOpenAIConfig(updatedConfig);
    };

    return (
        <div className="openai-config-container">
            <h2>Azure OpenAI Configuration</h2>
            <div className="config-form">
                <div className="form-group">
                    <label htmlFor="endpoint">Azure OpenAI Endpoint:</label>
                    <input
                        type="text"
                        id="endpoint"
                        name="endpoint"
                        value={config.endpoint}
                        onChange={handleInputChange}
                        placeholder="https://your-resource-name.openai.azure.com"
                    />
                    <small>Example: https://your-resource-name.openai.azure.com</small>
                </div>

                <div className="form-group">
                    <label htmlFor="modelName">Model Name:</label>
                    <input
                        type="text"
                        id="modelName"
                        name="modelName"
                        value={config.modelName}
                        onChange={handleInputChange}
                        placeholder="gpt-35-turbo or your deployment name"
                    />
                    <small>This is your deployment name in Azure OpenAI</small>
                </div>

                <div className="config-status">
                    {isConfigValid ? (
                        <div className="valid-config">Configuration is valid ✓</div>
                    ) : (
                        <div className="invalid-config">Please fill in all fields</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OpenAIConfig;
