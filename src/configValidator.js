/**
 * This file validates the environment configuration to ensure all required
 * variables are set properly before the application starts.
 */

/**
 * Validates MSAL configuration environment variables
 * @returns {Object} Object containing validation results
 */
export const validateMsalConfig = () => {
  const missingVars = [];
  
  // Check for required environment variables
  if (!process.env.REACT_APP_AZURE_AD_CLIENT_ID) {
    missingVars.push('REACT_APP_AZURE_AD_CLIENT_ID');
  }
  
  if (!process.env.REACT_APP_AZURE_TENANT_ID) {
    missingVars.push('REACT_APP_AZURE_TENANT_ID');
  }
  
  if (!process.env.REACT_APP_HOSTNAME) {
    missingVars.push('REACT_APP_HOSTNAME');
  }
  
  const isValid = missingVars.length === 0;
  
  return {
    isValid,
    missingVars,
    message: isValid 
      ? 'All environment variables configured correctly' 
      : `Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`
  };
};
