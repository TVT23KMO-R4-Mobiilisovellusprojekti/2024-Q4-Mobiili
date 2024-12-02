import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import Toast from "react-native-toast-message";
import { saveUserToFirestore } from "../../services/firestoreUsers";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  Image,
} from "react-native";
import globalStyles from "../../assets/styles/Styles";
import GlobalButtons from "../../assets/styles/GlobalButtons";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // for registration

  const toggleAuthForm = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const showToast = (type, title, message) => {
    Toast.show({ type, text1: title, text2: message });
  };

  const handleRegister = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await saveUserToFirestore(user.uid, username, email.toLocaleLowerCase());
      showToast("success", "Käyttäjätunnus luotu!", "Voit nyt kirjautua!");
      setIsLogin(true);
    } catch (error) {
      showToast(
        "error",
        "Rekisteröinti epäonnistui",
        error.message || "Yhteysvirhe"
      );
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      showToast(
        "error",
        "Kirjautuminen epäonnistui",
        error.message || "Yhteysvirhe"
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const { user } = userCredential;

      console.log('Login Success:', userInfo);
      if (userCredential.additionalUserInfo.isNewUser) { // Tarkistetaan onko käyttäjä uusi käyttäjä
        await saveUserToFirestore(user.uid, user.displayName, user.email.toLocaleLowerCase());
        showToast("success", "Käyttäjätunnus luotu!", "Voit nyt kirjautua!");
      } else {
        showToast("success", "Kirjautuminen onnistui!", "Tervetuloa takaisin!");
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) { // Käyttäjä perui kirjautumisen
      } else if (error.code === statusCodes.IN_PROGRESS) { // Kirjautuminen on jo käynnissä
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) { // Play servicet on nurin tai ei saavutettavissa
      } else {
        console.error('Login Failed:', error);
        showToast("error", "Google Kirjautuminen epäonnistui", error.message || "Yhteysvirhe");
      }
    }
  };

  const authButtonText = isLogin ? "Kirjaudu sisään" : "Rekisteröidy";
  const switchText = isLogin
    ? "Eikö sinulla ole tiliä?"
    : "Onko sinulla jo tili?";

  return (
    <View style={[styles.container, globalStyles.container]}>
      <Text style={[styles.title, globalStyles.title]}>
        {isLogin ? "Kirjaudu sisään" : "Rekisteröidy"}
      </Text>
      {!isLogin && (
          <TextInput
              placeholder="Käyttäjänimi"
              value={username}
              onChangeText={setUsername}
              style={[styles.input, globalStyles.input]}
          />
      )}
      <TextInput
        placeholder="Sähköposti"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, globalStyles.input]}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        style={[styles.input, globalStyles.input]}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={GlobalButtons.buttonContinue}
          onPress={isLogin ? handleLogin : handleRegister}
        >
          <Text style={GlobalButtons.whiteBase16}>{authButtonText}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.switchContainer}>
        <Text style={[styles.caption, globalStyles.caption]}>{switchText}</Text>
        <TouchableOpacity onPress={toggleAuthForm} style={styles.switchButton}>
          <Text style={[styles.switchButtonText, globalStyles.text]}>
            {isLogin ? "Rekisteröidy" : "Kirjaudu"}
          </Text>
        </TouchableOpacity>
        </View>
        <View style={styles.googleButtonContainer}>
          <TouchableOpacity onPress={handleGoogleLogin}>
            <Image
              source={require('../../assets/android_light_rd.png')}
              style={styles.googleButtonImage}
            />
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 25,
  },
  switchButton: {
    marginStart: 4,
  },
  switchButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  caption: {
    fontSize: 16,
    color: "#666",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  googleButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
  },
  googleButtonImage: {
    width: 225,
    height: 50,
  },
});

export default AuthScreen;
