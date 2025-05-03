import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "../graph";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ProfileData } from "./ProfileData";

/**
 * Renders a sign-out button with the user's name and toggle dropdown
 */
export const SignOutButton = () => {
    const { instance, accounts } = useMsal();
    const [userName, setUserName] = useState("User");
    const [graphData, setGraphData] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

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
    
    const handleRequestProfile = () => {
        if (!graphData) {
            // If we don't have the graph data yet, request it
            instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            }).then((response) => {
                callMsGraph(response.accessToken).then((response) => {
                    setGraphData(response);
                    setShowProfileModal(true);
                });
            }).catch(error => {
                console.log(error);
            });
        } else {
            // If we already have the graph data, just show the modal
            setShowProfileModal(true);
        }
    }
    
    return (
        <>
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
                <Dropdown.Item as="button" onClick={handleRequestProfile}>
                    View Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as="button" onClick={handleLogout}>
                    Sign out
                </Dropdown.Item>
            </DropdownButton>

            <Modal
                show={showProfileModal}
                onHide={() => setShowProfileModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {graphData ? (
                        <ProfileData graphData={graphData} />
                    ) : (
                        <p>Loading profile data...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
