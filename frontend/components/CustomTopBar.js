import React, { useState, useContext } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import globalStyles from '../assets/styles/Styles';
import { AuthenticationContext } from "../context/AuthenticationContext";
import logo from '../assets/images/kierttisTitle.png';
import { useFontSize } from './FontSizeContext';

const CustomTopBar = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const authState = useContext(AuthenticationContext);

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

  //saavutettavuus:
  //const FontSizeContext = createContext();
  //export const FontSizeProvider = ({ children }) => {
    const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize(); // Initial font size
  /*
    const increaseFontSize = () => {
      setFontSize(fontSize + 2);
    }
    const decreaseFontSize = () => {
      setFontSize(fontSize - 2);
    };
  */
   //saavutettavuus koodi päättyy

  return (
    <>
      {authState ? (
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
            <Menu.Item onPress={() => navigateToScreen('AccountLoggedIn')} title="Tilin hallinta" />
            <Menu.Item onPress={() => navigateToScreen('ItemsMain')} title="Julkaisut" />
            <Menu.Item onPress={() => navigateToScreen('Credits')} title="Tietoa sovelluksesta" />
          </Menu>

          <Appbar.Content
            title="Kierttis"
            titleStyle={globalStyles.appBarTitle}
            style={globalStyles.appBarContainer}
          />
        </Appbar.Header>
      ) : (
        <Appbar.Header style={globalStyles.appBarAuthUndef}>

          <Image source={logo} style={globalStyles.logo} />
          <Appbar.Content
            title="Kierttis"
            titleStyle={globalStyles.appBarTitleAuthUndef}
            style={globalStyles.appBarContainerAuthUndef}
            />
            <Button icon="font-size" onPress={increaseFontSize}>
              A
            </Button>
            <Button icon="font-size" onPress={decreaseFontSize}>
              A
            </Button>
        </Appbar.Header>
      )}
    </>
  );
};

export default CustomTopBar;