import React, { useContext, useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Heading, BasicSection } from "../../components/CommonComponents";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { firestore } from "../../services/firebaseConfig";
import {
  doc,
  query,
  where,
  collection,
  getDoc,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { useNavigation } from "@react-navigation/native";

const ThreadCard = ({ thread }) => {
  const [itemName, setItemName] = useState("");
  const [participants, setParticipants] = useState([]);
  const navigation = useNavigation();

  // sample authState for testing
  const { authState } = {
    user: {
      id: "CzmNeYO7av152mqA9SHY",
      username: "testuser",
    },
  };

  useEffect(() => {
    const fetchItemName = async () => {
      const itemRef = doc(firestore, "items", thread.item.id);
      const itemSnap = await getDoc(itemRef);
      if (itemSnap.exists()) {
        setItemName(itemSnap.data().itemname);
      }
    };

    // fetch participants
    const fetchParticipants = async () => {
      const participants = await Promise.all(
        thread.participants.map(async (participantRef) => {
          const userSnap = await getDoc(participantRef);
          return userSnap.exists()
            ? {
                id: userSnap.id,
                ...userSnap.data(),
              }
            : {};
        })
      );
      setParticipants(participants);
    };

    fetchItemName();
    fetchParticipants();
  }, []);

  const formatTimestamp = (timestamp) => {
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chat", { threadId: thread.id })}
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemName}>{itemName}</Text>
          <Text style={styles.participants}>
            {participants.find((p) => p.id !== authState.user.id)?.username}
          </Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.latestMessage}>
            {thread.latestMessage?.sender?.id === authState.user.id
              ? "Sinä: "
              : participants.find(
                  (p) => p.id === thread.latestMessage?.sender.id
                )?.username + ": "}
            {thread.latestMessage?.content || "Ei viestejä"}
          </Text>
          {thread.latestMessage && thread.latestMessage.createdAt && (
            <Text style={styles.timestamp}>
              {formatTimestamp(thread.latestMessage.createdAt)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
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
    fontWeight: "bold",
    color: "#333",
  },
  participants: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  latestMessage: {
    fontSize: 14,
    color: "#888",
    flex: 1,
    fontStyle: "italic",
  },
  timestamp: {
    fontSize: 12,
    color: "#aaa",
    marginLeft: 8,
  },
});

export default ThreadCard;
