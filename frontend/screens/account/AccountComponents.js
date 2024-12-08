import React, { useContext } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { auth } from "../../services/firebaseConfig";
import { Heading, BasicSection } from "../../components/CommonComponents";
import { ButtonNavigate } from "../../components/Buttons";
import {
  DeleteAccountOfThisUser,
  LogoutFromThisUser,
  MessagingSystem,
  AccountSystem,
  ChangeUsernameOfThisUser,
} from "./FindUser";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../assets/styles/Styles";
import { IconChat, IconMyItemList, IconNewDocument, IconMyQueueList, IconLogout, IconRemoveUser } from '../../components/Icons';
import { signOut } from "firebase/auth";

export const AccountLoggedIn = () => {
  const authState = useContext(AuthenticationContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log(`UID: ${authState.user.id} uloskirjautui`);
      navigation.navigate("AccountMain");
    } catch (error) {
      console.error("Virhe uloskirjautumisessa:", error);
      Alert.alert(
        "Virhe",
        "Uloskirjautumisessa tapahtui virhe. Yritä uudelleen."
      );
    }
  };

  // handleUsernameChange

  if (!authState) {
    return <Text>Ei käyttäjätietoja saatavilla.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Käyttäjän omat" />
      <View style={globalStyles.viewIcons}>
        <View style={globalStyles.iconWithText}>
          <IconChat onPress={() => navigation.navigate("MessagesMain")} />
          <Text style={globalStyles.textWithIcon}>Keskustelut</Text>
        </View>

        <View style={globalStyles.iconWithText}>
          <IconMyItemList onPress={() => navigation.navigate("MyItems")} />
          <Text style={globalStyles.textWithIcon}>Ilmoitukset</Text>
        </View>

        <View style={globalStyles.iconWithText}>
          <IconMyQueueList onPress={() => navigation.navigate("MyQueues")} />
          <Text style={globalStyles.textWithIcon}>Varaukset</Text>
        </View>
      </View>

      <Heading title="Tilin hallinta" />
      <View style={globalStyles.viewIcons}>
        <View style={globalStyles.iconWithText}>
          <IconRemoveUser onPress={() => navigation.navigate('AccountMaintain')} />
          <Text style={globalStyles.textWithIcon}>Poista tili</Text>
        </View>

        <View style={globalStyles.iconWithText}>
          <IconRemoveUser onPress={() => navigation.navigate('AccountUsername')} />
          <Text style={globalStyles.textWithIcon}>Vaihda käyttäjänimi</Text>
        </View>

        <View style={globalStyles.iconWithText}>
          <IconLogout onPress={handleLogout} />
          <Text style={globalStyles.textWithIcon}>Kirjaudu ulos</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export const AccountMaintain = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <DeleteAccountOfThisUser />
    </ScrollView>
  );
};

//käyttäjänimen koodia
export const AccountUsername = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <ChangeUsernameOfThisUser />
    </ScrollView>
  );
};
