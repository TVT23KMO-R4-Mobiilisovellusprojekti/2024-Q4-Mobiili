import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Heading } from "../../components/CommonComponents";
import ThreadCard from "./ThreadCard";
import useThreads from "../../hooks/useThreads";
import Toast from "react-native-toast-message";
import { firestore } from "../../services/firebaseConfig";
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const ThreadList = ({ threads }) => {
  return (
    <ScrollView style={styles.scrollContainer}>
      {threads.length > 0 ? (
        threads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)
      ) : (
        <Text style={styles.noThreadsText}>
          Aktiivisia keskusteluja ei löytynyt
        </Text>
      )}
    </ScrollView>
  );
};

const MessagesMain = () => {
  const threads = useThreads((state) => state.threads);
  const [filteredThreads, setFilteredThreads] = useState([]);

  useEffect(() => {
    if (threads.length > 0) {
      Toast.show({
        type: "info",
        text1: "Uusi viesti",
        text2: "Sait viestin yhteen keskusteluun",
      });
    }

    //Funktio, joka tarkistaa, että onko varattu esine olemassa
    const checkItemExistence = async (thread) => {
      try {
        const itemRef = doc(firestore, thread.item.path);
        const itemSnap = await getDoc(itemRef);
        if (itemSnap.exists()) {
          return true;
        } else {
          console.log("Esinettä ei löydy, poistetaan viestiketju:", thread.id);
          await deleteDoc(doc(firestore, "threads", thread.id));
          return false;
        }
      } catch (error) {
        console.error("Error checking item existence:", error);
        return false;
      }
    };

    //Funktio, joka tarkistaa, että onko viestiketjun vaatima varaus olemassa
    const checkReservationInTakers = async (thread) => {
      try {
        const itemRef = doc(firestore, thread.item.path);
        const takersCollectionRef = collection(itemRef, "takers");
        const q = query(
          takersCollectionRef,
          where("takerId", "in", thread.participants)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          console.log("Varaus löytyy takers-alikokoelmasta:", thread.id);
          return true;
        } else {
          console.log(
            "Varausta ei löydy takers-alikokoelmasta, poistetaan viestiketju:",
            thread.id
          );
          await deleteDoc(doc(firestore, "threads", thread.id));
          return false;
        }
      } catch (error) {
        console.error(
          "Error checking reservation in takers subcollection:",
          error
        );
        return false;
      }
    };

    const filterThreads = async () => {
      const validThreads = [];
      for (const thread of threads) {
        const itemExists = await checkItemExistence(thread);
        const reservationStatus = await checkReservationInTakers(thread);
        if (itemExists && reservationStatus) {
          validThreads.push(thread);
        }
      }
      setFilteredThreads(validThreads);
    };

    filterThreads();
  }, [threads]);

  return (
    <View style={styles.container}>
      <Heading title="Omat keskustelut" />
      <ThreadList threads={threads.threads} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f0f0f0",
  },
  scrollContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  noThreadsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 16,
  },
});

export default MessagesMain;
