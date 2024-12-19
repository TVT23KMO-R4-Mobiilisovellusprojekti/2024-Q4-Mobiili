import { pad } from "lodash";
import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 2,
  },

  separatorThin: {
    height: 1,
    backgroundColor: '#ccc', 
    marginVertical: 16,
  },

  separatorBold: {
    height: 3,
    backgroundColor: '#ddd', 
    marginVertical: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 90,
  },

  authPadding: {
    padding: 24,
  },

  iconContainer: {
    marginTop: 10,
    marginBottom: 16,
    marginLeft: 7,
    flexDirection: 'row',  
    alignItems: 'center', 
  },

  iconTextContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },

  iconText: {
    fontSize: 12,
    color: "#000",
    marginLeft: 4,
  },

  textWithIcon: {
    fontSize: 12,
    color: "#000",
  },

  iconsOnUse: {
    fontSize: 40,
    marginHorizontal: 5,
  },

  iconStyle: {
    fontSize: 44,
    color: "#000",
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
  },

  defText: {
    fontSize: 18,
    color: "#000",
    marginLeft: 4,
  },

  defTitle: {
    fontSize: 34,
    color: "#000",
    marginLeft: 8,
    fontFamily: "Chewy",
  },

  betwTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f6b0d",
    textAlign: "center",
    marginVertical: 16,
  },

  scrollViewContainer: {
    flexGrow: 1,
    padding: 12,
  },

  headingContainer: {
    padding: 16,
    marginTop: 14,
    marginBottom: 12,
    borderRadius: 3,
    zIndex: 2,
  },

  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },

  sectionContainer: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },

  itemContainer: {
    margin: 8,
    padding: 11,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderBottom: 2,
    borderStyle: "solid",
    borderColor: "#000",
  },

  items: {
    padding: 8,
    marginBottom: 12,
  },

  textContainer: {
    padding: 8,
    marginBottom: 8,
  },

  textInput: {
    flex: 1,
  },

  textItemTitle: {
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },

  textDescription: {
    height: 200,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 8,
  },
  
  text: {
    flex: 1,
  },

  appBar: {
    backgroundColor: "#0f3e5b",
    height: 98,
  },

  appBarAuthUndef: {
    backgroundColor: "#0f3e5b",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',   
    height: 181,
  },

  appBarContainerAuthUndef: {
    flex: 1,
    position: "absolute",
    paddingTop: 27,
    alignItems: "center",
    zIndex: 2,
  },

  appBarTitleAuthUndef: {
    fontFamily: "Chewy",
    fontSize: 40,
    color: "#000444",
    paddingVertical: 15,
    textShadowColor: "#fff", 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 6,
  },
  
  appBarTitle: {
    fontFamily: "Chewy",
    fontSize: 40,
    color: "#98F9B9",
    paddingVertical: 15,
  },

  appBarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "left",
    paddingTop: 27,
    alignItems: "center",
    marginLeft: -60,
  },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2c373e",
    padding: 20,
    height: 75,
  },

  iconButton: {
    alignItems: "center",
  },

  appContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    padding: 8,
    marginBottom: 16,
  },

  resultsContainer: {
    height: 250,
    marginBottom: 16,
  },

  suggestion: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 2,
  },

  noResults: {
    padding: 10,
    color: "gray",
  },

  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  disabledButton: {
    fontSize: 55,
    color: "#ccc",
  },

  mapContainer: {
    marginTop: 20,
  },

  map: {
    minHeight: 200,
    maxHeight: 200,
    flex: 1,
    marginBottom: 16,
  },

  buttonMargin: {
    marginVertical: 20,
    width: "100%",
  },

  logo: {
    width: 160,
    height: 160,
    zIndex: 2,  
  },

  findItems: {
    width: 44,
    height: 44,
  },

  viewButtons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: 8,
  },

  userButton: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: 8,
  },

  viewIcons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 9,
    backgroundColor: "#e5e5e5",
    marginTop: -18,
    width: "80%",
    alignSelf: "center",
    borderRadius: 8,
  },

  iconWithText: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
  },

  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },

  errorText: {
    color: "red",
    fontSize: 16,
  },

  image: {
    width: '98%',
    height: undefined, 
    aspectRatio: 1 / 1,
    borderRadius: 8, 
    marginVertical: 20,
    alignSelf: 'center',
  },

  suggestionsList: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 2,
  },

  autocompleteItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 2,
  },

});

export default globalStyles;
