# Project Description

## Frontend Webchat Page for Azure OpenAI Service

### Overview

This project aims to develop a reactJS frontend webchat page that allows users to interact with Azure OpenAI service. The page will enable users to configure their Azure Open AI model name, and endpoint. Upon configuration, users can log in to Azure using their credentials and utilize the Azure OpenAI API for chatting.
The web page will be designed to be used on a phone, ensuring a responsive and user-friendly experience.

### Features

- **Configuration Page**: Users can input their Azure Open AI model name, and endpoint.
- **Azure Authentication**: Integration with Microsoft Entra ID (formerly Azure AD) for secure authentication using MSAL.js.
- **Token Acquisition**: Use the Azure credential from MSAL-react to access the Azure OpenAI API endpoint through Entra ID authentication.
- **Chat Interface**: A user-friendly chat interface to send messages and receive responses from the Azure OpenAI model.
- **Token Management**: Secure handling and storage of access tokens for API calls.

### Tech Stack

- **Frontend**:
  - **HTML**: Structure the webchat page and configuration form.
  - **CSS**: Style the chat interface and configuration page for a responsive design.
  - **JavaScript**: Handle user interactions, API calls, and authentication. **Note**, it is not typescript.
  - **MSAL-react**: Microsoft Authentication Library for JavaScript to manage Azure authentication and token acquisition.
  - **Azure Open AI library**: Library for interacting with Azure OpenAI services.
  - **React**: A JavaScript library for building user interfaces.

- **Backend**:
  - **Azure OpenAI Service**: Utilize Azure's OpenAI models for generating responses to user queries.
  - **Azure AD**: Microsoft Entra ID for secure authentication and authorization.


- **References**:
  - [MSAL-react Documentation](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-single-page-app-sign-in?pivots=workforce&tabs=react-workforce%2Creact-external)
  - [Azure OpenAI Service Entra ID connection Documentation](https://learn.microsoft.com/en-us/javascript/api/overview/azure/openai-readme?view=azure-node-latest)