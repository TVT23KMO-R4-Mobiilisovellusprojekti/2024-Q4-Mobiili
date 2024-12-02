import React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Heading } from '../../components/CommonComponents';
import { ButtonAdd, ButtonNavigate } from '../../components/Buttons';
import { useNavigation } from '@react-navigation/native';
import { MyItems } from './MyItems';
import { AllItems } from './FetchItems';
import { AddItem } from './AddItem';
import { ItemQueues } from './ItemQueues';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../../assets/styles/Styles';
import { deleteExpiredStuff } from '../../services/firestoreQueues';
import { deleteExpiredItems } from '../../services/firestoreItems';
import { IconChat, IconMyItemList, IconNewDocument, IconMyQueueList } from '../../components/Icons';

const ItemsMain = () => {
  deleteExpiredItems();
  deleteExpiredStuff();

  const navigation = useNavigation(); 

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>

        <Heading title="Ilmoitukset" />
        <View style={globalStyles.viewIcons}>
          <IconNewDocument onPress={() => navigation.navigate('ItemAddView')} />
          <IconMyItemList onPress={() => navigation.navigate('MyItems')} />
          <IconMyQueueList onPress={() => navigation.navigate('MyQueues')} />
        </View>

        <AllItems />

    </ScrollView>
  );
};

export default ItemsMain;

export const ItemAddView = () => {

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <AddItem />
    </ScrollView>
  );
}

export const ItemsFromThisUser = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Omat ilmoitukset" />
      <TouchableOpacity onPress={() => navigation.goBack()} style={globalStyles.iconContainer}>
        <View style={globalStyles.iconTextContainer}>
          <Icon name="arrow-back" size={30} color="#000" />
          <Text style={globalStyles.iconText}>Takaisin</Text>
        </View>
      </TouchableOpacity>

      <MyItems />
    </ScrollView>
  );
}

export const QueuesOfThisUser = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Omat varaukset" />
      <TouchableOpacity onPress={() => navigation.goBack()} style={globalStyles.iconContainer}>
        <View style={globalStyles.iconTextContainer}>
          <Icon name="arrow-back" size={30} color="#000" />
          <Text style={globalStyles.iconText}>Takaisin</Text>
        </View>
      </TouchableOpacity>

      <ItemQueues />
    </ScrollView>
  );
}



