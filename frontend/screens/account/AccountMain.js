import React, { useContext } from 'react';
import { AccountLoggedIn, AccountLoggedOut } from './AccountComponents';
import { AuthenticationContext } from "../../context/AuthenticationContext";

const AccountMain = () => {
    const authState = useContext(AuthenticationContext);

    return (
    <>
        {authState ? (
            <AccountLoggedIn />
        ) : (
            <AccountLoggedOut/>
        )}
    </>
    );
};

export default AccountMain;