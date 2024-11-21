import React from 'react';
import { ScrollView } from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';
import { ButtonAdd, ButtonNavigate } from '../../components/Buttons';
import { useNavigation } from '@react-navigation/native';
import { MyItems } from './MyItems';
import { AllItems } from './FetchItems';
import { AddItem } from './AddItem';
import { ItemQueues } from './ItemQueues';

export const ItemsLoggedOut = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <BasicSection>
        Kirjaudu sisään palvelun käyttäjänä päästäksesi tekemään löytöjä ja julkaisemaan omia ilmoituksia! {"\n"}
      </BasicSection>
    </ScrollView>
  );
};

export const ItemsLoggedIn = () => {
  const navigation = useNavigation(); 

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
        <Heading title="Ilmoitukset" />
        <ButtonAdd title="Uusi ilmoitus" onPress={() => navigation.navigate('ItemAddView')}></ButtonAdd>
        <AllItems />
        <Heading title="Omat listaukset" />
        <ButtonNavigate
          title="Ilmoitukset"
          onPress={() => navigation.navigate('MyItems')}
        />
        <ButtonNavigate
          title="Varaukset"
          onPress={() => navigation.navigate('MyQueues')}
        />
    </ScrollView>
  );
};

export const ItemAddView = () => {

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <AddItem />
    </ScrollView>
  );
}

export const ItemsFromThisUser = () => {

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Omat ilmoitukset" />

      <MyItems />
    </ScrollView>
  );
}

export const QueuesOfThisUser = () => {

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <ItemQueues />
    </ScrollView>
  );
}