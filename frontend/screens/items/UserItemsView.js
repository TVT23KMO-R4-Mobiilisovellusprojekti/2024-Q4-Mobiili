import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import useUserData from "../../hooks/useUserData";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BasicSection, Heading } from "../../components/CommonComponents";
import globalStyles from "../../assets/styles/Styles";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { ItemCard } from "./ItemCard";
import { fetchFirstInQueue } from "../../services/firestoreItems.js";

export const UserItemsView = () => {
  const navigation = useNavigation();
  const { items, userItemsLoading, userItemsError, removeItem } = useUserData();
  const [queueUsernames, setQueueUsernames] = useState({});
  const [someoneOnQueue, setSomeoneOnQueue] = useState(false);

  const handleDelete = async (itemId) => {
    try {
      await removeItem(itemId);
      console.log(`Item ${itemId} poistettu.`);
    } catch (error) {
      console.error("Virhe poistettaessa itemiä:", error);
    }
  };

  const checkIfSomeoneOnQueue = async (itemId) => {
    try {
      const firstInQueue = await fetchFirstInQueue(itemId);
      setSomeoneOnQueue(firstInQueue !== null);

      if (firstInQueue) {
        setQueueUsernames((prevState) => ({
          ...prevState,
          [itemId]: firstInQueue,
        }));
      }
    } catch (error) {
      console.error("Virhe jonottajien tarkistamisessa:", error);
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      items.forEach((item) => {
        checkIfSomeoneOnQueue(item.id);
      });
    }
  }, [items]);

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Omat ilmoitukset" />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={globalStyles.iconContainer}
      >
        <View style={globalStyles.iconTextContainer}>
          <Icon name="arrow-back" size={30} color="#000" />
          <Text style={globalStyles.iconText}>Takaisin</Text>
        </View>
      </TouchableOpacity>

      {userItemsError ? (
        <Toast
          type="error"
          text1="Virhe omien julkaisujen hakemisessa"
          text2={userItemsError.message}
        />
      ) : (
        <View style={globalStyles.container}>
          {userItemsLoading ? (
            <BasicSection>
              <Text>Ladataan...</Text>
            </BasicSection>
          ) : items.length > 0 ? (
            items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                showActions={true}
                onRemove={handleDelete}
                someoneOnQueue={someoneOnQueue}
                queueUsernames={queueUsernames}
              />
            ))
          ) : (
            <Text>Julkaisuja ei löytynyt.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};
