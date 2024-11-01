import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-native-paper';
import { AuthenticationContext } from './services/auth';
import { fetchUserDataFromStorage } from './services/asyncStorageHelper';
import globalStyles from './assets/styles/Styles';
import CustomTopBar from './components/CustomTopBar';
import CustomBottomBar from './components/CustomBottomBar';
import Home from './screens/home/Home';
import AccountMain from './screens/account/AccountMain';
import { AccountLoggedIn, AccountLoggedOut } from './screens/account/AccountComponents';
import ItemsMain from './screens/items/ItemsMain';
import Credits from './screens/credits/Credits';

const Stack = createStackNavigator();

export default function App() {
  const [authState, setAuthState] = useState(fetchUserDataFromStorage());
 
  return (
    <Provider>
      <AuthenticationContext.Provider value={{ authState, setAuthState}}>
        <NavigationContainer>
          <CustomTopBar />
            <View style={globalStyles.container}>
              <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen name="AccountMain" component={AccountMain} options={{ headerShown: false }} />
                <Stack.Screen name="AccountLoggedIn" component={AccountLoggedIn} options={{ headerShown: false }} />
                <Stack.Screen name="AccountLoggedOut" component={AccountLoggedOut} options={{ headerShown: false }} />
                <Stack.Screen name="ItemsMain" component={ItemsMain} options={{ headerShown: false }} />
                <Stack.Screen name="Credits" component={Credits} options={{ headerShown: false }} />
              </Stack.Navigator>
            </View>
          <CustomBottomBar />
        </NavigationContainer>
      </AuthenticationContext.Provider>
    </Provider>
  );
}
