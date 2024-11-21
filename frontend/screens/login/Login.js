import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { Alert, View } from "react-native";
import Toast from "react-native-toast-message";
import {
  AccountSection,
  CommonText,
  Heading,
} from "../../components/CommonComponents";
import { Icon } from "react-native-elements";
import { ButtonContinue } from "../../components/Buttons";

export const Login = ({ isVisible, toggleVisible }) => {
  const [usermail, setLoginUsername] = useState("");
  const [password, setLoginPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const data = await signInWithEmailAndPassword(auth, usermail, password);
      if (data) {
        // konteksti hoitaa tilan päivityksen automaattisesti
      } else {
        Alert.alert(
          "Kirjautuminen epäonnistui",
          "Virheellinen käyttäjätunnus tai salasana"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Virhe kirjautumisessa", error.message || "Yhteysvirhe");
      Toast.show({
        type: "error",
        text1: "Kirjautuminen epäonnistui",
        text2: error.message || "Yhteysvirhe",
      });
    }
  };

  return (
    <View>
      <Heading
        title="Kirjaudu sisään"
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
            value="Kirjaudu sisään omalla käyttäjätunnuksellasi ja salasanallasi."
            editable={false}
          />
          <CommonText
            value={usermail}
            onChangeText={setLoginUsername}
            editable={true}
            trailingIcon={() => <Icon name="person" />}
          />
          <CommonText
            value={password}
            onChangeText={setLoginPassword}
            editable={true}
            trailingIcon={() => <Icon name="lock" />}
            secureTextEntry
          />
          <ButtonContinue title="Kirjaudu" onPress={handleLogin} />
        </AccountSection>
      )}
    </View>
  );
};