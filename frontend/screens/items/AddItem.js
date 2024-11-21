import React, { useState } from 'react';
import { addItemToFirestore } from '../../services/firestoreItems.js';
import { Heading } from '../../components/CommonComponents';
import { ButtonAdd } from '../../components/Buttons';
import { View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyles from "../../assets/styles/Styles.js";
import Toast from 'react-native-toast-message';

export const AddItem = () => {
    const [itemname, setItemname] = useState('');
    const [itemdescription, setItemdescription] = useState('');
    const [postalcode, setPostalcode] = useState('');
    const [city, setCity] = useState('');
    const navigation = useNavigation();

    const handleAddItem = async () => {
    
        try {
        const response = await addItemToFirestore(itemname, itemdescription, postalcode, city);
        console.log('Add item response:', response);
        Toast.show({ type: 'success', text1: 'Julkaisu lisätty!',  });
    
        navigation.navigate('ItemsMain');
        } catch (error) {
        console.error('Add item error:', error);
        Toast.show({ type: 'error', text1: 'Virhe julkaisua lisättäessä', text2: error.message, });
        }
    };
    
    return (
        <View style={globalStyles.container}>
        <Heading title="Lisää uusi ilmoitus" />
        <TextInput
            style={globalStyles.textInput}
            placeholder="Otsikko (tuotteen nimi)"
            value={itemname}
            onChangeText={setItemname}
        />
        <TextInput
            style={globalStyles.textInput}
            placeholder="Kuvaus tuotteesta"
            value={itemdescription}
            onChangeText={setItemdescription}
            multiline
        />
        <TextInput
            style={globalStyles.textInput}
            placeholder="Postinumero"
            keyboardType="numeric"
            value={postalcode}
            onChangeText={setPostalcode}
        />
        <TextInput
            style={globalStyles.textInput}
            placeholder="Kaupunki"
            value={city}
            onChangeText={setCity}
        />
    
        <ButtonAdd title="Julkaise" onPress={handleAddItem} color="#4CAF50" />
        </View>
    );
    };

