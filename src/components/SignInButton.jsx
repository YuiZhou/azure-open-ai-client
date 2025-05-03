import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

/**
 * Renders a button for logging in with redirect
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.log(e);
        });
    }
    
    return (
        <button 
            className="btn btn-transparent ml-auto" 
            onClick={handleLogin}
        >
            Sign In
        </button>
    )
}
