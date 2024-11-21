import React, { useState, useEffect, useContext } from 'react';
import { ButtonCancel, ButtonSave } from '../../components/Buttons';
import { Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BasicSection } from '../../components/CommonComponents';
import globalStyles from "../../assets/styles/Styles.js";
import Toast from 'react-native-toast-message';
import { 
  addTakerToItem,
  deleteTakerFromItem,
  getCurrentUserQueues,
  getCurrentUserQueuesForItems, 
} from '../../services/firestoreQueues.js';
import { checkIfMyItem } from '../../services/firestoreItems.js';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { set } from 'lodash';

export const ItemJoinOnQueue = ({ itemId }) => {
    const [isOnQueue, setIsOnQueue] = useState(false); 
    const [isMyItem, setIsMyItem] = useState(false);
    const authState = useContext(AuthenticationContext);
  
    const checkIfOnQueue = async () => {
      try {
        const result = await getCurrentUserQueues(authState.user.id, itemId);
        setIsOnQueue(result);
      } catch (error) {
        console.error('Virhe:', error);
      }
    };
  
    const saveForQueue = async (itemId) => {
      try {
        await addTakerToItem(authState.user.id, itemId);
        setIsOnQueue(true); 
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Virhe varausta tehdessä', text2: error.message });
      }
    };
  
    const deleteFromQueue = async (itemId) => {
      try {
        await deleteTakerFromItem(authState.user.id, itemId);
        setIsOnQueue(false);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Virhe jonosta poistettaessa', text2: error.message });
      }
    };
  
    useEffect(() => {
      const fetchIsMyItem = async () => {
          try {
              const result = await checkIfMyItem(authState.user.id, itemId); 
              setIsMyItem(result);
          } catch (error) {
              console.error("Virhe omistajuuden tarkistuksessa:", error);
          }
      };

      checkIfOnQueue();
      fetchIsMyItem();
  }, [itemId]);
  
    return (
      <>
        {isMyItem ? (
          <Text>Oma ilmoitus: esim. jonottajien määrä tähän</Text>
        ) : (
          isOnQueue ? (
            <ButtonCancel title="Peruuta varaus" onPress={() => deleteFromQueue(itemId)} />
          ) : (
            <ButtonSave title="Varaa" onPress={() => saveForQueue(itemId)} />
          )
          
        )}
      </>
    );
};


export const ItemQueues = () => {
  const [queue, setQueue] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const pageSize = 4;
  const navigation = useNavigation();
  const authState = useContext(AuthenticationContext);

  useEffect(() => {
    const fetchQueues = async () => {
      if (!hasMore) return;

      try {
        const { queues: newQueue, lastDoc: newLastDoc } = await getCurrentUserQueuesForItems(authState.user.id, lastDoc, pageSize);
        if (newQueue) {
          setQueue((prevQueue) => [...prevQueue, ...newQueue]);
          setLastDoc(newLastDoc);
          setHasMore(newQueue.length === pageSize);
        } else {
          setQueue([]);
          setHasMore(false); 
        }
      } catch (error) {
        console.error('Virhe jonon hakemisessa:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueues();
  }, [lastDoc]);

  if (loading) {
    return (
      <BasicSection>
        <Text>Ladataan...</Text>
      </BasicSection>
    );
  }

  if (error) {
    return (
      <BasicSection>
        <Toast type="error" text1="Virhe jonon hakemisessa" text2={error.message} />
        <Button title="Yritä uudelleen" onPress={() => setError(null) || setLoading(true)} />
      </BasicSection>
    );
  }

  return (
    <View style={globalStyles.container}>
      {queue.length > 0 ? (
        queue.map((item) => (
          <View key={item.id} style={globalStyles.itemContainer}>
            <Text style={globalStyles.itemName}>{item.itemname}</Text>
            <Text>{item.itemdescription}</Text>
            <Text>Sijainti: {item.postalcode}, {item.city}</Text>
            <Text>Julkaisija: {item.giverid.id}</Text>
            <Text>{item.createdAt ? formatTimestamp(item.createdAt) : 'Päivämäärä ei saatavilla'}</Text>
            <ItemJoinOnQueue itemId={item.id} />
          </View>
        ))
      ) : (
        <BasicSection style={{ alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: '#555' }}>Ei varauksia.</Text>
        </BasicSection>
      )}
      {hasMore && (
        <Button
          title="Lataa lisää"
          onPress={() => setLoading(true) || setLastDoc(lastDoc)}
          disabled={loading}
        />
      )}
    </View>
  );
};
