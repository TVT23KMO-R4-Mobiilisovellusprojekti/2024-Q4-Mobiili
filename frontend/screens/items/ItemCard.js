import { Text, TouchableOpacity, View, Image } from "react-native";
import globalStyles from "../../assets/styles/Styles";
import { formatTimestamp } from "../../services/firestoreGlobal";
import React, { useEffect, useState } from "react";
import useUserData from "../../hooks/useUserData";
import { useAuth } from "../../context/AuthenticationContext";
import useItemStore from "../../store/useItemStore";
import { fetchQueueCount } from "../../services/firestoreItems";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import {
  ButtonCancel,
  ButtonConfirm,
} from "../../components/Buttons";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { useRoute } from "@react-navigation/native";
import {IconChat, IconTrash} from "../../components/Icons";
import Constants from 'expo-constants';

export const ItemCard = ({
  item,
  onRemove = () => {},
  showActions = false,
  someoneOnQueue = false,
  queueUsernames = {},
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleToggleDeleteConfirmation = () =>
    setConfirmDelete((prev) => !prev);

  return (
    <View style={globalStyles.itemContainer}>
      <ItemDetails item={item} />
      {showActions ? (
        <ActionButtons
          isConfirmDeleteVisible={confirmDelete}
          onRemove={onRemove}
          onToggle={handleToggleDeleteConfirmation}
          queueUsernames={queueUsernames}
          item={item}
        />
      ) : (
        <ItemJoinOnQueue itemId={item.id} />
      )}

      {someoneOnQueue && queueUsernames[item.id] ? (
        <>
          <Text>Noutosijalla: {queueUsernames[item.id]}</Text>
        </>
      ) : (
        <>
          <Text>Ei vielä varaajia.</Text>
        </>
      )}
    </View>
  );
};

const ActionButtons = ({ isConfirmDeleteVisible, onRemove, onToggle, queueUsernames, item }) => (
  <View style={globalStyles.viewButtons}>
    {isConfirmDeleteVisible ? (
      <>
        <ButtonConfirm title="Poista" onPress={onRemove} />
        <ButtonCancel title="Peruuta" onPress={onToggle} />
      </>
    ) : (
      <>
        <IconChat
          onPress={() => navigation.navigate("ItemsMain")}
          disabled={!queueUsernames[item.id]}
        />
        <IconTrash onPress={onToggle} />
      </>
    )}
  </View>
);

const ItemDetails = ({ item }) => {
  const routeName = useRoute().name;

  const getExpoServerUrl = (url) => {
        if (!url) return url;    
        // Jos URL on jo täysi (alkaa 'http://')
        const isFullUrl = /^http:\/\//.test(url);
        if (isFullUrl) {
            // Jos URL on täysi ja sisältää Expo-palvelimen IP-osoitteen, ei tarvitse muuttaa
            const expoServerIp = Constants.expoGoConfig.debuggerHost.split(':')[0];
            if (url.includes(expoServerIp)) {
                return url; // Palautetaan alkuperäinen URL, jos Expo-palvelimen IP löytyy jo
            } else {
                // Jos Expo-palvelimen IP ei ole mukana, muokkaa se
                return url.replace(/http:\/\/[^/]+/, `http://${expoServerIp}:8081`);
            }
        }
    
        // Jos URL on suhteellinen (alkaa '/assets'), muutetaan se Expo-palvelimen URL:ksi
        if (url.startsWith('/assets')) {
            const expoServerIp = Constants.expoGoConfig.debuggerHost.split(':')[0];
            return `http://${expoServerIp}:8081${url}`;  // Muodostetaan URL Expo-palvelimelle
        }
    
        // Muutoin palautetaan alkuperäinen URL
        return url;
    };

  return (
    <>
      <Text style={globalStyles.itemName}>{item.itemname}</Text>
      <Image source={{ uri: getExpoServerUrl(item.imageUrl) }} style={globalStyles.itemImage} />
      {console.log(getExpoServerUrl(item.imageUrl))}
      <Text>{item.itemdescription}</Text>
      <Text>Paikkakunta: {item.city}</Text>
      {routeName !== "MyItems" && (
        <>
          <Text>Julkaisija: {item.givername}</Text>
          <Text>{formatTimestamp(item.createdAt)}</Text>
        </>
      )}
    </>
  );
};

const ItemJoinOnQueue = ({ itemId }) => {
  const { queues, items: userItems } = useUserData();
  const [queueCount, setQueueCount] = useState(0);
  const { user } = useAuth();
  const [loadingQueue, setLoadingQueue] = useState(true);

  const onQueue = queues.some((item) => item.id === itemId);
  const isUserItem = userItems.some((item) => item.id === itemId);
  const item = onQueue ? queues.find((item) => item.id === itemId) : null;

  const addUserToItemQueue = useItemStore((state) => state.addUserToQueue);
  const deleteItemFromQueue = useItemStore(
    (state) => state.removeUserFromQueue
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoadingQueue(true);
      try {
        const count = await fetchQueueCount(itemId);
        setQueueCount(count);
      } catch (error) {
        console.error("Virhe tietojen hakemisessa:", error);
      } finally {
        setLoadingQueue(false);
      }
    };
    fetchData();
  }, [itemId]);

  const handleSaveForQueue = async () => {
    try {
      const { queueCount } = await addUserToItemQueue(user.id, itemId);
      setQueueCount(queueCount);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Virhe varausta tehdessä",
        text2: error.message,
      });
    }
  };

  const handleDeleteFromQueue = async () => {
    try {
      const queueCount = await deleteItemFromQueue(user.id, itemId);
      setQueueCount(queueCount);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Virhe jonosta poistettaessa",
        text2: error.message,
      });
    }
  };

  if (loadingQueue) {
    return <LoadingIndicator />;
  }

  return (
    <>
      {isUserItem ? (
        <Text>Oma ilmoitus: Jonottajia: {queueCount}</Text>
      ) : (
        <View style={globalStyles.iconContainer}>
          <TouchableOpacity
            onPress={handleSaveForQueue}
            disabled={onQueue}
            style={globalStyles.iconButton}
          >
            <Icon
              name="checkmark-circle"
              color={onQueue ? "#bdbdbd" : "#195010"}
              style={globalStyles.iconsOnUse}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteFromQueue}
            disabled={!onQueue}
            style={globalStyles.iconButton}
          >
            <Icon
              name="close-circle"
              color={!onQueue ? "#bdbdbd" : "#790809"}
              style={globalStyles.iconsOnUse}
            />
          </TouchableOpacity>

          {onQueue ? (
            <Text style={globalStyles.iconText}>
              Varauksen sija: {item.inQueue.position}
            </Text>
          ) : (
            <Text style={globalStyles.iconText}>Jonottajia: {queueCount}</Text>
          )}
        </View>
      )}
    </>
  );
};
