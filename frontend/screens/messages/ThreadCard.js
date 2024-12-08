import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthenticationContext";
import { useNavigation } from "@react-navigation/native";
import { MessagePreview } from "./MessagePreview";

const ThreadCard = ({ thread }) => {
  const { user } = useAuth();
  const { participants, item } = thread;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chat", { threadId: thread.id })}
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemName}>{item.itemname}</Text>
          <Text style={styles.participants}>
            {participants.find((p) => p.id !== user.id)?.username}
          </Text>
        </View>
        <MessagePreview
          message={thread.latestMessage}
          participants={participants}
        />
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
});

export default ThreadCard;
