---
page_type: sample
languages:
- javascript
products:
- azure
- ms-graph
- microsoft-identity-platform
- azure-openai
name: React single-page app (SPA) that signs in user and integrates with Azure OpenAI
url-fragment: msal-react-single-page-app-openai
description: This React application demonstrates usage of the Microsoft Authentication Library for React (MSAL React) to sign in Microsoft Entra users (authentication), call a protected web API (authorization), integrate with Azure OpenAI using Entra ID, and sign out users.
---


# React single-page app (SPA) | Sign in users, call protected API and Azure OpenAI | Microsoft identity platform

This React application demonstrates usage of the Microsoft Authentication Library for React (MSAL React) to:

- Sign in Microsoft Entra users (authentication)
- Call a protected web API (authorization)
- Integrate with Azure OpenAI service using Entra ID authentication

## Environment Setup

This application uses environment variables for configuration. Before running the app:

1. Create a `.env` file in the root directory
2. Add the following variables with your own values:
   ```
   REACT_APP_AZURE_AD_CLIENT_ID=your-client-id
   REACT_APP_AZURE_TENANT_ID=your-tenant-id
   REACT_APP_HOSTNAME=http://localhost:3000
   ```
3. You can use the `.env.example` file as a template
   ```
   AZURE_AD_CLIENT_ID=your-client-id
   AZURE_TENANT_ID=your-tenant-id
   HOSTNAME=http://localhost:3000
   ```

## Environment Variable Configuration

This project uses `react-app-rewired` and custom webpack configuration to allow environment variables without the `REACT_APP_` prefix. This setup includes:

1. A `config-overrides.js` file that configures webpack to expose all environment variables from `.env` to the application.
2. Custom npm scripts in `package.json` that use `react-app-rewired` instead of `react-scripts`.

After cloning the repository, install the dependencies with:

```bash
npm install
```

Then you can start the development server with:

```bash
npm start
```

These variables are automatically injected by webpack during the build process.

## Azure OpenAI Integration

This application includes an Azure OpenAI chat interface that allows users to:

1. Configure their Azure OpenAI endpoint and model deployment name
2. Authenticate with Microsoft Entra ID to access Azure OpenAI services
3. Chat with an Azure OpenAI model through a user-friendly interface

### Setup Requirements

To use the Azure OpenAI chat feature, you need:

1. An Azure subscription with access to Azure OpenAI services
2. An Azure OpenAI resource deployed in your subscription
3. A model deployment (e.g., GPT-35-Turbo, GPT-4) in your Azure OpenAI resource
4. The role assignment "Cognitive Services OpenAI User" for your Microsoft Entra user account on your Azure OpenAI resource

### Configuration Steps

1. Sign in to the application with your Microsoft Entra account
2. Navigate to the "Azure OpenAI Chat" page
3. Enter your Azure OpenAI endpoint URL (e.g., https://YOUR-RESOURCE-NAME.openai.azure.com)
4. Enter your model deployment name
5. Grant permissions to access Azure OpenAI when prompted
6. Start chatting with your Azure OpenAI model

## Available scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
