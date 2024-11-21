import React, { useContext, useState } from "react";
import { ScrollView, Text } from "react-native";
import { Heading, BasicSection } from "../../components/CommonComponents";
import {
  DeleteAccountOfThisUser,
  LogoutFromThisUser,
  MessagingSystem,
  AccountSystem,
} from "./FindUser";
import { AuthenticationContext } from "../../context/AuthenticationContext";

export const AccountLoggedOut = () => { 

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <BasicSection>
          Täältä löydät tilisi näkymän, kun olet kirjautunut. {"\n"}
      </BasicSection>
    </ScrollView>
  );
};

export const AccountLoggedIn = () => {
  const authState = useContext(AuthenticationContext);

  if (!authState) {
    return <Text>No user data found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Käyttäjän omat" />
      <MessagingSystem />
      {/*<NavigateToThisUsersItems />*/}
      {/*<NavigateToThisUsersQueue />*/}
      <AccountSystem />
      <LogoutFromThisUser />
    </ScrollView>
  );
};

export const AccountMaintain = () => {
  const authState = useContext(AuthenticationContext);

  if (!authState) {
    return <Text>No user data found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <DeleteAccountOfThisUser />
    </ScrollView>
  );
};