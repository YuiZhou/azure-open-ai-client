/**
 * Configuration file for Azure OpenAI service
 */

// Constants for local storage keys
export const OPENAI_CONFIG_STORAGE_KEY = "openai_config";

// Default configuration
export const DEFAULT_OPENAI_CONFIG = {
    endpoint: "",
    modelName: "",
};

/**
 * Store OpenAI configuration in localStorage
 * @param {Object} config - The configuration object containing endpoint and modelName
 */
export const saveOpenAIConfig = (config) => {
    localStorage.setItem(OPENAI_CONFIG_STORAGE_KEY, JSON.stringify(config));
};

/**
 * Retrieve OpenAI configuration from localStorage
 * @returns {Object} The configuration object or default values if not found
 */
export const getOpenAIConfig = () => {
    const storedConfig = localStorage.getItem(OPENAI_CONFIG_STORAGE_KEY);
    return storedConfig ? JSON.parse(storedConfig) : DEFAULT_OPENAI_CONFIG;
};

/**
 * Checks if OpenAI configuration is valid
 * @param {Object} config - The configuration object to validate
 * @returns {Boolean} True if configuration is valid
 */
export const isOpenAIConfigValid = (config) => {
    return config.endpoint && config.endpoint.trim() !== "" && 
           config.modelName && config.modelName.trim() !== "";
};
