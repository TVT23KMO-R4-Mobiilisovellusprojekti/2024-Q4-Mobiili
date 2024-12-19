import React, { useState, useContext } from 'react';
import { ScrollView, Button, TextInput } from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';
import { updateUserData } from '../../services/firestoreUsers';
import globalStyles from '../../assets/styles/Styles';
import GlobalButtons from '../../assets/styles/GlobalButtons';
import Toast from "react-native-toast-message";
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { useNavigation } from '@react-navigation/native';
//import { ButtonChange } from "../../components/Buttons";

export const AccountUsername = () => {

    const authState = useContext(AuthenticationContext);
    const [username, setUsername] = useState('');

    const [isUpdating, setIsUpdating] = useState(false);
    const navigation = useNavigation();
    
    const usernameChange = async () => {
      setIsUpdating (true)
      try {
        await updateUserData(authState.user.id, username);
        console.log("Käyttäjänimi vaihdettu");
        Toast.show({
          type: "success",
          text1: "Käyttäjänimi vaihdettu"
        })
        navigation.navigate("AccountMain");

      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Muokkausvirhe",
          text2: error.message,
      });
      } finally {
        setIsUpdating (false)
      }

  };

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Change Account Username?" />

      <BasicSection>
        Tässä voit muokata käyttäjänimesi.{"\n\n"}
        <TextInput 
          placeholder ='Uusi käyttäjänimi'
          value = {username}
          onChangeText={setUsername}
          style = {globalStyles.textInput}
        />
        {"\n\n"}
        {/* ehtolause kun väli ja kysymysmerkki, jos true niin tuo viimeinen osio, elvis-ehtolause*/}
        {/* alkup. Button-lauseke:  */}
          <Button
          title = {isUpdating ? "Päivitetään..." : "Vaihda käyttäjänimi"}
          onPress = {usernameChange}    
          disabled = {isUpdating} 
          style = {GlobalButtons.buttonBase}
          />
      </BasicSection>
    </ScrollView>
  );
};

export default AccountUsername;


