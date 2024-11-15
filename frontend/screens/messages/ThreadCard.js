import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';
import { AuthenticationContext } from '../../services/auth';
import { firestore } from '../../services/firebaseConfig';
import { doc, query, where, collection, getDoc, getDocs, orderBy, limit } from 'firebase/firestore';

const ThreadCard = ({ thread }) => {
  const [itemName, setItemName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [latestMessage, setLatestMessage] = useState('');

  const authState = {
    user: {
      id: "CzmNeYO7av152mqA9SHY",
      username: "testuser",
    },
  }

  useEffect(() => {
    // fetch item name
    const fetchItemName = async () => {      
      const itemRef = doc(firestore, 'items', thread.item.id);
      const itemSnap = await getDoc(itemRef);
      if (itemSnap.exists()) {
        setItemName(itemSnap.data().itemname);
      }
    };

    // fetch participant usernames
    const fetchParticipants = async () => {
      const participants = await Promise.all(
        thread.participants.map(async (participantRef) => {
          const userSnap = await getDoc(participantRef);
          return userSnap.exists() ? {
            id: userSnap.id,
            ...userSnap.data(),
          } : {};
        })
      );
      setParticipants(participants);
      
    };

    // fetch latest message from the "messages" subcollection
    const fetchLatestMessage = async () => {
      const messagesRef = collection(firestore, 'threadstest', thread.id, 'messages');
      
      const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      
      
      if (!querySnapshot.empty) {
        const latestMessageData = querySnapshot.docs[0].data();
        setLatestMessage(latestMessageData);
      }
    };

    fetchItemName();
    fetchParticipants();
    fetchLatestMessage();
  }, []);
  
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.itemName}>{itemName}</Text>
        <Text style={styles.participants}>{participants.find(p => p.id !== authState.user.id)?.username}</Text>
      </View>
      <Text style={styles.latestMessage}>
        {latestMessage.sender?.id === authState.user.id ? 'You: ' : participants.find(p => p.id === latestMessage.sender.id)?.username + ': '}
        {latestMessage.content || 'Ei viestejä'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  participants: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  latestMessage: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default ThreadCard;