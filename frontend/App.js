import React, { useContext } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-native-paper";
import {
  AuthenticationContext,
  AuthenticationProvider,
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
import {
  ItemsFromThisUser,
  QueuesOfThisUser,
  ItemAddView,
} from "./screens/items/ItemsMain";
import ItemsMain from "./screens/items/ItemsMain";
import Toast from "react-native-toast-message";
import ChatView from "./screens/chat/ChatView";
import AuthScreen from "./screens/auth/AuthScreen";
import { ThreadsProvider } from "./context/ThreadsContext";
import { LoadingProvider } from "./context/LoadingContext";
import { AccountUsername } from "./screens/account/AccountUsername";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const authState = useContext(AuthenticationContext);

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
            name="ItemAddView"
            component={ItemAddView}
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
            name="AccountUsername"
            component={AccountUsername}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ItemsMain"
            component={ItemsMain}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyItems"
            component={ItemsFromThisUser}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyQueues"
            component={QueuesOfThisUser}
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
        <ThreadsProvider>
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
        </ThreadsProvider>
      </AuthenticationProvider>
    </Provider>
  );
};

export default App;
