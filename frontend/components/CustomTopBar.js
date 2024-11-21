import React, { useState, useContext } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import globalStyles from '../assets/styles/Styles';
import { AuthenticationContext } from "../context/AuthenticationContext";

const CustomTopBar = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const { authState } = useContext(AuthenticationContext);

  const [loaded] = useFonts({
    Chewy: require('../assets/fonts/ChewyRegular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const navigateToScreen = (screenName) => {
    setMenuVisible(false);
    navigation.navigate(screenName);
  };

  return (
    <Appbar.Header style={globalStyles.appBar}>
      
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action 
            icon="menu" 
            size={46}
            color="#ffffff"
            onPress={() => setMenuVisible(true)} 
          />
        }
      >
         
        <Menu.Item onPress={() => navigateToScreen('Home')} title="Aloitus" />
        <Menu.Item onPress={() => navigateToScreen(authState ? 'AccountLoggedIn' : 'AccountLoggedOut')} title="Tilin hallinta" />
        <Menu.Item onPress={() => navigateToScreen('ItemsMain')} title="Julkaisut" />
        <Menu.Item onPress={() => navigateToScreen('Credits')} title="Tietoa sovelluksesta" />
      </Menu>

      <Appbar.Content 
        title="Kierttis" 
        titleStyle={globalStyles.appBarTitle}
        style={globalStyles.appBarContainer}
      />

    </Appbar.Header>
  );
};

export default CustomTopBar;