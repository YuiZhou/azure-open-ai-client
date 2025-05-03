/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

import { useIsAuthenticated } from '@azure/msal-react';
import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';
import SideMenu from './SideMenu';

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    const toggleSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };

    const closeSideMenu = () => {
        setIsSideMenuOpen(false);
    };

    return (
        <>
            <Navbar bg="transparent" variant="light" className="navbarStyle">
                <button className="menu-toggle" onClick={toggleSideMenu} aria-label="Toggle navigation menu">
                    <span className="menu-toggle-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end">
                    {isAuthenticated ? <SignOutButton /> : <SignInButton />}
                </div>
            </Navbar>
            
            <SideMenu 
                isOpen={isSideMenuOpen} 
                onClose={closeSideMenu} 
                onSelectConversation={props.onSelectConversation}
            />
            
            <div className="profileContent">
                {props.children}
            </div>
        </>
    );
};
