import { pad } from 'lodash';
import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({

  container: {
      flex: 1,
  },

  scrollViewContainer: {
      flexGrow: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      padding: 12,
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 1, 
  },

  headingContainer: {
      padding: 16,
      marginTop: 14,
      marginBottom: 12,
      borderRadius: 3,
  },

  title: {
      textAlign: 'center',
  },

  sectionContainer: {
    padding: 8,
    borderRadius: 8,
  },

  itemContainer: {
    margin: 8,
    padding: 11,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },

  textContainer: {
      padding: 8,
      marginBottom: 8,
  },

  textInput: {
      flex: 1,
  },

  text: {
      flex: 1,
  },
  
  appBar: {
      backgroundColor: '#0f3e5b',
      height: 98,
  },

  appBarTitle: {
      fontFamily: 'Chewy',
      fontSize: 40,
      color: '#98F9B9',
      paddingVertical: 15,
    },

  appBarContainer: {
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'left', 
      paddingTop: 27, 
      alignItems: 'center',
      marginLeft: -60,
  },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    backgroundColor: '#2c373e',
    padding: 20,
    height: 75,
  },

  iconButton: {
    alignItems: 'center',
  },
  
  appContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
  },

  label: {
      fontSize: 16,
      marginBottom: 8,
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 16,
  },

  resultsContainer: {
    height: 250,
    marginBottom: 16,
  },

  suggestion: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 2,
  },

  noResults: {
    padding: 10,
    color: 'gray',
  },

  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },

  disabledButton: {
    backgroundColor: '#a0a0a0',
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
    width: '100%',
  },

  logo: {
    width: 76,
    height: 76,
  },

  findItems: {
    width: 44,
    height: 44,
  },

  viewButtons: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: 8,
  },

  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  errorText: {
      color: 'red',
      fontSize: 16,
  }

});

export default globalStyles;