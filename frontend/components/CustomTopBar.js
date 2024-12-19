import React, { useState, useContext } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import globalStyles from '../assets/styles/Styles';
import { AuthenticationContext } from "../context/AuthenticationContext";
import logo from '../assets/images/kierttisTitle.png';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
//saavutettavuus
//import { useFontSize } from '../assets/styles/FontSizeContext';

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
          
          <Appbar.Action 
            icon="format-annotation-minus" 
            size={36}
            color="#ffffff"
            onPress={() => {    
              console.log("Pienennä fonttia");
                    Toast.show({
                      type: "success",
                      text1: "Pienennä fonttia"
                    });
            }} 
            />
          <Appbar.Action 
            icon="format-annotation-plus" 
            size={36}
            color="#ffffff"
            onPress={() => {    
              console.log("Suurenna fonttia");
                    Toast.show({
                      type: "success",
                      text1: "Suurenna fonttia"
                    });
            }} 
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
        </Appbar.Header>
      )}
    </>
  );
};

export default CustomTopBar;