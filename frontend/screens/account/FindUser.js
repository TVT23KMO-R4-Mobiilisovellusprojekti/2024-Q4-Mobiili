import React, { useContext, useState } from "react";
import { auth } from "../../services/firebaseConfig";
import { Alert, View } from "react-native";
import { BasicSection, Heading } from "../../components/CommonComponents";
import {
  ButtonCancel,
  ButtonConfirm,
  ButtonDelete,
  ButtonNavigate,
} from "../../components/Buttons";
import { useNavigation } from "@react-navigation/native";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import globalStyles from "../../assets/styles/Styles.js";
import Toast from "react-native-toast-message";
import { deleteUserDataFromFirestore } from "../../services/firestoreUsers.js";
import { signOut, deleteUser } from "firebase/auth";

export const DeleteAccountOfThisUser = () => {
  const authState = useContext(AuthenticationContext);
  const [isDeletingThisAccount, setIsDeletingThisAccount ] = useState(false);
  const navigation = useNavigation();

  const userDelete = async () => {
    try {

      await deleteUserDataFromFirestore(authState.user.id);
      const currentUser = auth.currentUser;
      await deleteUser(currentUser);
      console.log("Käyttäjän autentikointitili poistettu");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Poistovirhe",
        text2: error.message,
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await userDelete();
      navigation.navigate("Home");
      Alert.alert("Tilin poisto onnistui");
    } catch (error) {
      Alert.alert("Tapahtui virhe", error.message);
    }
  };

  const handleDoubleCheckWhenDeleting = () => {
    setIsDeletingThisAccount(true);
  };

  const handleConfirmWhenDeleting = () => {
    handleDeleteUser();
  };

  return (
    <>
      <Heading title="Poista tili" />

      {!isDeletingThisAccount ? (
         <>
         <BasicSection>
           Mikäli poistat käyttäjätilisi palvelusta, sen kaikki tiedot
           poistetaan. Vahvistusta kysytään kerran painaessasi "Poista tili".
         </BasicSection>
         <View style={globalStyles.viewButtons}>
           <ButtonDelete
             title="Poista"
             onPress={handleDoubleCheckWhenDeleting}
           />
            <ButtonCancel
              title="Peruuta"
              onPress={navigation.goBack}
            />
         </View>
       </>
      ) : (
        <>
          <BasicSection>Oletko varma? {"\n\n"}</BasicSection>
          <View style={globalStyles.viewButtons}>
            <ButtonConfirm
              title="Vahvista"
              onPress={handleConfirmWhenDeleting}
            />
            <ButtonCancel
              title="Peruuta"
              onPress={navigation.goBack}
            />
          </View>
        </>
      )}
    </>
  );
};

export const LogoutFromThisUser = () => {

  const navigation = useNavigation();
  const authState = useContext(AuthenticationContext);

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

  return (
    <>
      <ButtonNavigate title="Kirjaudu ulos" onPress={handleLogout} />
    </>
  );
};

export const MessagingSystem = () => {
  const navigation = useNavigation();

  return (
    <>
      <ButtonNavigate
        title="Keskustelut"
        onPress={() => navigation.navigate("MessagesMain")}
      />
    </>
  );
};

export const NavigateToThisUsersItems = () => {
  const navigation = useNavigation();

  return (
    <>
      <ButtonNavigate
        title="Ilmoitukset"
        onPress={() => navigation.navigate("MessagesMain")}
      />
    </>
  );
};

export const NavigateToThisUsersQueue = () => {
  const navigation = useNavigation();

  return (
    <>
      <ButtonNavigate
        title="Varaukset"
        onPress={() => navigation.navigate("MessagesMain")}
      />
    </>
  );
};

export const AccountSystem = () => {
  const navigation = useNavigation();

  return (
    <>
      <ButtonNavigate
        title="Poista tili"
        onPress={() => navigation.navigate("AccountMaintain")}
      />
    </>
  );
};
