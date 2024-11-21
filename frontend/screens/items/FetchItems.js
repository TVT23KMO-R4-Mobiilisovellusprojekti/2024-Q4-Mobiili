import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { BasicSection, Heading } from '../../components/CommonComponents';
import { paginateItems } from '../../services/firestoreItems.js';
import { ItemJoinOnQueue } from './ItemQueues.js';
import globalStyles from '../../assets/styles/Styles.js';
import { Timestamp } from 'firebase/firestore';

const formatTimestamp = (timestamp) => {
    if (timestamp instanceof Timestamp) {
        const date = timestamp.toDate(); 
        return date.toLocaleString(); 
    }
    return timestamp;
};

export const AllItems = () => {
    const [items, setItems] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const pageSize = 4;

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        setError(null);

        try {
            const { items: newItems, lastDoc: newLastDoc } = await paginateItems(lastDoc, pageSize);
            setItems((prevItems) => [...prevItems, ...newItems]);
            setLastDoc(newLastDoc);

            if (newItems.length < pageSize) {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Virhe ladattaessa kohteita:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && items.length === 0) {
        return (
          <BasicSection> <Text>Ladataan...</Text> </BasicSection>
        );
      }
    
      if (error) {
        return (
          <BasicSection> <Text>Virhe: {error.message}</Text> </BasicSection>
        );
      }

    return (
        <View style={{ flex: 1, padding: 8 }}>
            <Heading title="Kaikki ilmoitukset" />

            {items.map((item) => (
                <View key={item.id} style={globalStyles.itemContainer}>
                <Text style={globalStyles.itemName}>{item.itemname}</Text>
                <Text>{item.itemdescription}</Text>
                <Text>Sijainti: {item.postalcode}, {item.city}</Text>
                <Text>Julkaisija: {item.giverid.id}</Text>
                <Text>{formatTimestamp(item.createdAt)}</Text>
                <ItemJoinOnQueue itemId={item.id} />
                </View>
            ))}

        {hasMore && (
            <Button title="Näytä lisää" onPress={loadItems} disabled={loading} />
        )}

        {!hasMore && (
            <Text style={{ textAlign: 'center', marginTop: 16 }}>Ei enempää kohteita</Text>
        )}
        
        </View>
    );
};
