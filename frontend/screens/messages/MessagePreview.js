import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../context/AuthenticationContext";
import { Text, View, StyleSheet } from "react-native";
import React from "react";

const formatTimestamp = (timestamp) => {
  return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
};

export const MessagePreview = ({ message, participants }) => {
  const { user } = useAuth();

  if (!message) {
    return (
      <Text style={styles.messageContainer}>
        <Text style={styles.latestMessage}>Ei Viestejä</Text>
      </Text>
    );
  }

  const messageText =
    message.sender.id === user.id
      ? "Sinä: " + message.content
      : participants.find((p) => p.id === message.sender.id)?.username +
        ": " +
        message.content;

  const timestampText = message.createdAt
    ? formatTimestamp(message.createdAt)
    : "";

  return (
    <View style={styles.messageContainer}>
      <Text style={styles.latestMessage}>{messageText}</Text>
      {timestampText && <Text style={styles.timestamp}>{timestampText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
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
