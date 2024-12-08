import "react-native-url-polyfill/auto";
import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-native-paper";
import {
  AuthenticationProvider,
  useAuth,
} from "./context/AuthenticationContext";
import globalStyles from "./assets/styles/Styles";
import CustomTopBar from "./components/CustomTopBar";
import CustomBottomBar from "./components/CustomBottomBar";
import Home from "./screens/home/Home";
import AccountMain from "./screens/account/AccountMain";
import {
  AccountLoggedIn,
  AccountMaintain,
} from "./screens/account/AccountComponents";
import Credits from "./screens/credits/Credits";
import MessagesMain from "./screens/messages/MessagesMain";
import ItemsMain from "./screens/items/ItemsMain";
import Toast from "react-native-toast-message";
import ChatView from "./screens/chat/ChatView";
import AuthScreen from "./screens/auth/AuthScreen";
import { LoadingProvider } from "./context/LoadingContext";
import { AddItemView } from "./screens/items/AddItemView";
import { UserItemsView } from "./screens/items/UserItemsView";
import { UserQueues } from "./screens/items/UserQueues";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const authState = useAuth();

  return (
    <Stack.Navigator initialRouteName="AuthScreen">
      {authState ? (
        // User authenticated
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AccountMain"
            component={AccountMain}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AccountLoggedIn"
            component={AccountLoggedIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddItemView"
            component={AddItemView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Credits"
            component={Credits}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MessagesMain"
            component={MessagesMain}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AccountMaintain"
            component={AccountMaintain}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ItemsMain"
            component={ItemsMain}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyItems"
            component={UserItemsView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyQueues"
            component={UserQueues}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatView}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        // User not authenticated
        <>
          <Stack.Screen
            name="AuthScreen"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider>
      <AuthenticationProvider>
        <NavigationContainer>
          <CustomTopBar />
          <View style={globalStyles.container}>
            <LoadingProvider>
              <AppNavigator />
            </LoadingProvider>
          </View>
          <CustomBottomBar />
          <Toast />
        </NavigationContainer>
      </AuthenticationProvider>
    </Provider>
  );
};

export default App;
