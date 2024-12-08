import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthenticationContext";
import Toast from "react-native-toast-message";
import {
  Keyboard,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import globalStyles from "../../assets/styles/Styles";
import { Heading } from "../../components/CommonComponents";
import { ButtonAdd } from "../../components/Buttons";
import useItemStore from "../../store/useItemStore";
import regionsAndCities from "../../components/Sorted-maakunnat.json";
import placeholderImage from '../../assets/images/kiertis-icon.png'; 

export const AddItemView = () => {
  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    city: "",
  });
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const allCities = Object.values(regionsAndCities).flat();
  const navigation = useNavigation();
  const { user } = useAuth();
  const addItem = useItemStore((state) => state.addItem);
  const placeholderImageUrl = Image.resolveAssetSource(placeholderImage).uri;

  const handleAddItem = async () => {
    if (!itemData.city) {
      Toast.show({
        type: "error",
        text1: "Valitse paikkakunta ennen julkaisua",
      });
      return;
    }

    try {
      await addItem({
        userId: user.id,
        itemname: itemData.name,
        itemdescription: itemData.description,
        city: itemData.city,
        imageUrl: placeholderImageUrl
      });
      Toast.show({ type: "success", text1: "Julkaisu lisätty!" });

      navigation.navigate("ItemsMain");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Virhe julkaisua lisättäessä",
        text2: error.message,
      });
    }
  };

  const handleChange = (name, value) => {
    setItemData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "city") handleCityInputChange(value);
  };

  const handleCityInputChange = (input) => {
    if (input.trim() === "") {
      setFilteredCities([]);
      setShowSuggestions(false);
    } else {
      const filtered = allCities.filter((c) =>
        c.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowSuggestions(true);
    }
  };

  const handleCitySelection = (selectedCity) => {
    setItemData((prevData) => ({ ...prevData, city: selectedCity }));
    setFilteredCities([]);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <View style={globalStyles.container}>
        <Heading title="Lisää uusi ilmoitus" />
        <ItemForm
          itemData={itemData}
          handleChange={handleChange}
          onPress={handleAddItem}
          handleCityInputChange={handleCityInputChange}
          showSuggestions={showSuggestions}
          filteredCities={filteredCities}
          handleCitySelection={handleCitySelection}
        />
      </View>
    </ScrollView>
  );
};

const ItemForm = ({
  itemData,
  handleChange,
  onPress,
  handleCitySelection,
  showSuggestions,
  filteredCities,
}) => {
  return (
    <>
      <TextInput
        style={globalStyles.textItemTitle}
        placeholder="Otsikko (tuotteen nimi)"
        value={itemData.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        style={globalStyles.textDescription}
        placeholder="Kuvaus tuotteesta"
        value={itemData.description}
        onChangeText={(value) => handleChange("description", value)}
        multiline
      />
      <View style={globalStyles.imageContainer}>
                <Image 
                    style={globalStyles.placeholderImage}
                    source={placeholderImage}
                />
                <Text style={globalStyles.imageText}>Tuotekuva</Text>
            </View> 
      <TextInput
        style={globalStyles.textItemTitle}
        placeholder="Paikkakunta (tuotteen sijainti)"
        value={itemData.city}
        onChangeText={(value) => handleChange("city", value)}
      />

      {showSuggestions && (
        <ScrollView style={globalStyles.suggestionsList}>
          {filteredCities.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCitySelection(item)}
            >
              <Text style={globalStyles.autocompleteItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ButtonAdd title="Julkaise" onPress={onPress} color="#4CAF50" />
    </>
  );
};
