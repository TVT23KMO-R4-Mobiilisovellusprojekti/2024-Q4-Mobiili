import React, { useEffect, useState } from "react";
import useItemStore from "../../store/useItemStore";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { deleteExpiredStuff } from "../../services/firestoreQueues";
import { deleteExpiredItems } from "../../services/firestoreItems";
import { ItemCard } from "./ItemCard";
import { Text, View, ScrollView, TouchableOpacity, Keyboard, TextInput } from "react-native";
import { BasicSection, Heading } from "../../components/CommonComponents";
import { ButtonNavigate, ButtonPage } from "../../components/Buttons";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../assets/styles/Styles";
import {
    IconMyItemList,
    IconNewDocument,
    IconMyQueueList,
} from "../../components/Icons";
import regionsAndCities from "../../components/Sorted-maakunnat.json";

const ItemsMain = () => {
    const navigation = useNavigation();
    const items = useItemStore((state) => state.items);
    const fetchItems = useItemStore((state) => state.fetchItems);
    const error = useItemStore((state) => state.error);

    const [city, setCity] = useState("");
    const [filteredCities, setFilteredCities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const allCities = Object.values(regionsAndCities).flat();

    useEffect(() => {
        fetchItems(0);
        deleteExpiredItems();
        deleteExpiredStuff();
    }, []);

    const handleCityInputChange = async (input) => {
        setCity(input);

        if (input.trim() === "") {
            setFilteredCities([]);
            setShowSuggestions(false);
            await fetchItems(0);
        } else {
            const filtered = allCities.filter((c) =>
                c.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredCities(filtered);
            setShowSuggestions(true);
        }
    };

    const handleCitySelection = async (selectedCity) => {
        setCity(selectedCity);
        setFilteredCities([]);
        setShowSuggestions(false);
        Keyboard.dismiss();
        useItemStore.setState({ currentPage: 0 });
        await fetchItems(0, selectedCity);

        if (!selectedCity.trim()) {
            await fetchItems(0);
        } else {
            await fetchItems(0, selectedCity);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 8 }}>
            <Heading title="Kierrätyspaneeli" />
            <View style={globalStyles.viewIcons}>
                <View style={globalStyles.iconWithText}>
                    <IconNewDocument onPress={() => navigation.navigate("AddItemView")} />
                    <Text style={globalStyles.textWithIcon}>Uusi julkaisu</Text>
                </View>

                <View style={globalStyles.iconWithText}>
                    <IconMyItemList onPress={() => navigation.navigate("MyItems")} />
                    <Text style={globalStyles.textWithIcon}>Ilmoitukset</Text>
                </View>

                <View style={globalStyles.iconWithText}>
                    <IconMyQueueList onPress={() => navigation.navigate("MyQueues")} />
                    <Text style={globalStyles.textWithIcon}>Varaukset</Text>
                </View>
            </View>

            <View style={{ flex: 1, padding: 8 }}>
                <TextInput
                    style={globalStyles.textItemTitle}
                    placeholder="Hae paikkakunnan mukaan"
                    value={city}
                    onChangeText={handleCityInputChange}
                />
                {showSuggestions && (
                    <ScrollView style={globalStyles.suggestionsList}>
                        {filteredCities.map((cityName, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleCitySelection(cityName)}
                            >
                                <Text style={globalStyles.autocompleteItem}>{cityName}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
                {error ? (
                    <ErrorSection error={error} />
                ) : !items.length ? (
                    <LoadingIndicator />
                ) : (
                    <ItemList items={items} city={city} fetchItems={fetchItems} />
                )}
            </View>
        </ScrollView>
    );
};

const ErrorSection = ({ error }) => (
    <BasicSection>
        <Text>Virhe: {error.message}</Text>
    </BasicSection>
);

const ItemList = ({ items, city, fetchItems }) => {
    const loading = useItemStore((state) => state.loading);
    const isLastPage = useItemStore((state) => state.isLastPage);
    const currentPage = useItemStore((state) => state.currentPage);

    const handleNextPage = async () => {
        if (isLastPage) return;
        // setCurrentPage((prev) => prev + 1);
        useItemStore.setState({ currentPage: currentPage + 1 });
        await fetchItems(currentPage + 1, city);
    };

    const handlePreviousPage = async () => {
        if (currentPage === 0) return;
        // setCurrentPage((prev) => prev - 1);
        useItemStore.setState({ currentPage: currentPage - 1 });
        await fetchItems(currentPage - 1, city);
    };

    return (
        <>
            {items.map((item) => (
                <ItemCard key={item.id} item={item} />
            ))}
            {loading && <LoadingIndicator />}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 16,
                }}
            >
                <ButtonPage
                    title="Edellinen"
                    onPress={handlePreviousPage}
                    disabled={currentPage === 0 || loading}
                />
                <Text style={{ alignSelf: "center" }}>Sivu {currentPage + 1}</Text>
                <ButtonPage
                    title="Seuraava"
                    onPress={handleNextPage}
                    disabled={loading || isLastPage}
                />
            </View>
        </>
    );
};

const NavigationButtons = ({ navigation }) => (
    <>
        <ButtonNavigate
            title="Ilmoitukset"
            onPress={() => navigation.navigate("MyItems")}
        />
        <ButtonNavigate
            title="Varaukset"
            onPress={() => navigation.navigate("MyQueues")}
        />
    </>
);

export default ItemsMain;
