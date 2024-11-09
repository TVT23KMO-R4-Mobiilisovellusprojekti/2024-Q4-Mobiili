import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-native-paper";
import { AuthenticationContext } from "./services/auth";
import { fetchUserDataFromStorage } from "./services/asyncStorageHelper";
import globalStyles from "./assets/styles/Styles";
import CustomTopBar from "./components/CustomTopBar";
import CustomBottomBar from "./components/CustomBottomBar";
import Home from "./screens/home/Home";
import AccountMain from "./screens/account/AccountMain";
import {
  AccountLoggedIn,
  AccountLoggedOut,
  AccountMaintain,
} from "./screens/account/AccountComponents";
import ItemsMain from "./screens/items/ItemsMain";
import Credits from "./screens/credits/Credits";
import MessagesMain from "./screens/messages/MessagesMain";
import {
  ItemsFromThisUser,
  QueuesOfThisUser,
} from "./screens/items/ItemComponents";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "./services/firebaseConfig";

const Stack = createStackNavigator();

export default function App() {
  const [authState, setAuthState] = useState(fetchUserDataFromStorage());

  useEffect(() => {
    const addSampleData = async () => {
      const usersCollection = collection(firestore, "users");
      const itemsCollection = collection(firestore, "items");
      const takersCollection = collection(firestore, "takers");
      const threadsCollection = collection(firestore, "threads");
      const messagesCollection = collection(firestore, "messages");

      // users
      const user1Ref = await addDoc(usersCollection, {
        username: "testuser1",
        hashedpassword: "hashedpass1",
        usermail: "testuser1@example.com",
      });
      const user2Ref = await addDoc(usersCollection, {
        username: "testuser2",
        hashedpassword: "hashedpass2",
        usermail: "testuser2@example.com",
      });

      // items
      const item1Ref = await addDoc(itemsCollection, {
        giverid: user1Ref.id,
        itemname: "Bicycle",
        itemdescription: "Mountain bike",
        itempicture: "url/to/image1.jpg",
        queretruepickfalse: true,
        postalcode: "00100",
        city: "Helsinki",
      });

      // takers
      const taker1Ref = await addDoc(takersCollection, {
        userid: user2Ref.id,
        itemid: item1Ref.id,
        description: "",
      });

      // threads
      const thread1Ref = await addDoc(threadsCollection, {
        itemid: item1Ref.id,
        itemgiverid: user1Ref.id,
        takerid: taker1Ref.id,
      });

      await addDoc(messagesCollection, {
        threadid: thread1Ref.id,
        senderid: user1Ref.id,
        message: "hello",
      });
      await addDoc(messagesCollection, {
        threadid: thread1Ref.id,
        senderid: user2Ref.id,
        message: "hello",
      });

      console.log("Sample data added to Firestore");
    };

    addSampleData();
  }, []);

  return (
    <Provider>
      <AuthenticationContext.Provider value={{ authState, setAuthState }}>
        <NavigationContainer>
          <CustomTopBar />
          <View style={globalStyles.container}>
            <Stack.Navigator initialRouteName="Home">
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
                name="AccountLoggedOut"
                component={AccountLoggedOut}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ItemsMain"
                component={ItemsMain}
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
                name="MyItems"
                component={ItemsFromThisUser}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MyQueues"
                component={QueuesOfThisUser}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </View>
          <CustomBottomBar />
        </NavigationContainer>
      </AuthenticationContext.Provider>
    </Provider>
  );
}
