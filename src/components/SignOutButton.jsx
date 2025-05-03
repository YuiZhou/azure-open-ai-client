import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "../graph";

/**
 * Renders a sign-out button with the user's name and toggle dropdown
 */
export const SignOutButton = () => {
    const { instance, accounts } = useMsal();
    const [userName, setUserName] = useState("User");
    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
        if (accounts.length > 0) {
            // Set the username from account information if available
            setUserName(accounts[0].name || accounts[0].username || "User");
            
            // Get access token to call Microsoft Graph API
            instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            }).then((response) => {
                callMsGraph(response.accessToken)
                    .then(response => {
                        setGraphData(response);
                        // Update username with more accurate data from Graph API
                        if (response.displayName) {
                            setUserName(response.displayName);
                        }
                    });
            }).catch(error => {
                console.log(error);
            });
        }
    }, [accounts, instance]);

    const handleLogout = () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    }
    
    return (
        <DropdownButton 
            variant="transparent" 
            className="ml-auto" 
            drop="down" 
            align="end"
            title={userName}
        >
            {graphData && (
                <Dropdown.Item disabled>
                    {graphData.userPrincipalName}
                </Dropdown.Item>
            )}
            <Dropdown.Divider />
            <Dropdown.Item as="button" onClick={handleLogout}>
                Sign out
            </Dropdown.Item>
        </DropdownButton>
    )
}
