import React, { useEffect, useState } from 'react';
import { ButtonCancel, ButtonConfirm, ButtonDelete } from '../../components/Buttons';
import { Text, View } from 'react-native';
import { BasicSection } from '../../components/CommonComponents';
import globalStyles from "../../assets/styles/Styles.js";
import Toast from 'react-native-toast-message';
import { deleteItemFromFirestore, getCurrentUserItems } from '../../services/firestoreItems.js';
import { get, last } from 'lodash';

export const MyItems = () => {
    const [items, setItems] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeToggleId, setActiveToggleId] = useState(null);

    const pageSize = 4;

    useEffect(() => {
        const fetchItems = async () => {
            try {
                
                const { items: newItems, lastDoc: newLastDoc } = await getCurrentUserItems(lastDoc, pageSize);
                setItems((prevItems) => [...prevItems, ...newItems]);
                setLastDoc(newLastDoc);

            } catch (error) {
                console.error('Virhe omien tavaroiden hakemisessa:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleDelete = async (itemId) => {
        try {
          await deleteItemFromFirestore(itemId); 
          setItems((prevItems) => prevItems.filter((item) => item.id !== itemId)); 
          console.log(`Item ${itemId} poistettu.`);
        } catch (error) {
          console.error('Virhe poistettaessa itemiä:', error);
          setError(error);
        }
      };
    
      const toggleItem = (itemId) => {
        setActiveToggleId((prevId) => (prevId === itemId ? null : itemId)); 
      };
    
      if (loading) {
        return (
          <BasicSection> <Text>Ladataan...</Text> </BasicSection>
        );
      }
    
      if (error) {
        return (
            <Toast type="error" text1="Virhe omien julkaisujen hakemisessa" text2={error.message} /> 
        );
      }
    
      return (
        <View style={globalStyles.container}>
    
          {items.length > 0 ? (
            items.map((item) => (
              <View key={item.id} style={globalStyles.itemContainer}>
                <Text style={globalStyles.itemName}>{item.itemname}</Text>
                <Text>{item.itemdescription}</Text>
                <Text>{item.city}</Text>
                <Text>{item.postalcode}</Text>
    
                {activeToggleId !== item.id && (
                  <View style={globalStyles.viewButtons}>
                    <ButtonDelete title="Poista" onPress={() => toggleItem(item.id)} />
                  </View>
                )}
    
                {activeToggleId === item.id && (
                  <View style={globalStyles.viewButtons}>
                    <ButtonConfirm title="Vahvista" onPress={() => handleDelete(item.id)} />
                    <ButtonCancel title="Peruuta" onPress={() => toggleItem(null)} />
                  </View>
                )}
                
              </View>
            ))
          ) : (
            <Text>Julkaisuja ei löytynyt.</Text>
          )}
    
        </View>
      );
    }; 