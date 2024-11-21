import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import Toast from "react-native-toast-message";
import { saveUserToFirestore } from "../../services/firebaseController";
import { Alert } from "react-native";
import {
  AccountSection,
  CommonText,
  Heading,
} from "../../components/CommonComponents";
import { Icon } from "react-native-elements";
import { ButtonContinue } from "../../components/Buttons";

export const Register = ({ isVisible, toggleVisible }) => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");

  const userRegister = async (email, password, registerUsername) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      Toast.show({
        type: "success",
        text1: "Käyttäjätunnus luotu!",
        text2: "Voit nyt kirjautua!",
      });

      await saveUserToFirestore(uid, registerUsername, email);

      return { success: true, uid, username: registerUsername, email };
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Käyttäjän luominen epäonnistui.",
        text2: error.message,
      });
      console.error("Rekisteröinnissä tapahtui virhe:", error.message);
      throw error;
    }
  };

  const handleRegister = async () => {
    try {
      const data = await userRegister(
        registerEmail,
        registerPassword,
        registerUsername
      );
      if (data) {
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterUsername("");
      } else {
        Alert.alert(
          "Rekisteröityminen epäonnistui",
          "Virhe rekisteröitymisessä"
        );
      }
    } catch (error) {
      Alert.alert("Tapahtui virhe", error.message || "Ei yhteyttä palvelimeen");
    }
  };

  return (
    <>
      <Heading
        title="Rekisteröidy"
        onPress={toggleVisible}
        style={{
          backgroundColor: isVisible
            ? "rgba(25, 26, 30, 0.7)"
            : "rgba(18, 18, 18, 0.9)",
        }}
      />
      {isVisible && (
        <AccountSection>
          <CommonText
            value="Rekisteröidy palvelun käyttäjäksi täyttämällä pyydetyt kohdat."
            editable={false}
          />
          <CommonText
            placeholder="Käyttäjätunnus"
            value={registerUsername}
            onChangeText={setRegisterUsername}
            editable={true}
            trailingIcon={() => <Icon name="person" />}
          />
          <CommonText
            placeholder="Sähköposti"
            value={registerEmail}
            onChangeText={setRegisterEmail}
            editable={true}
            trailingIcon={() => <Icon name="email" />}
          />
          <CommonText
            placeholder="Salasana"
            value={registerPassword}
            onChangeText={setRegisterPassword}
            editable={true}
            trailingIcon={() => <Icon name="lock" />}
            secureTextEntry
          />
          <ButtonContinue title="Rekisteröidy" onPress={handleRegister} />
        </AccountSection>
      )}
    </>
  );
};