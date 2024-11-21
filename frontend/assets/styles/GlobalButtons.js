import { StyleSheet } from 'react-native';

const GlobalButtons = StyleSheet.create({

  buttonMargin: {
    marginVertical: 12, 
    marginHorizontal: 6,
  },

    buttonContinue: {
        backgroundColor: '#003366', 
        borderRadius: 22,
        padding: 16,
        marginVertical: 8,
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
        // Shadow for iOS + android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    
    buttonNavigate: {
        backgroundColor: '#e8e8e8', 
        borderRadius: 4,
        borderStyle: 'solid',
        borderColor: '#7d7d7d',
        borderWidth: 1,
        padding: 10,
        marginVertical: 5,
        //marginHorizontal: 22,
        alignItems: 'center',
        width: '60%',
        alignSelf: 'center',
    },
    
    buttonDelete: {
        backgroundColor: '#720002', 
        borderRadius: 22,
        borderColor: '#59050c',
        borderWidth: 3,
        borderStyle: 'solid',
        padding: 16,
        marginRight: 8,
        //margin: 8,
        width: '35%',
    },
    
      buttonConfirm: {
        backgroundColor: '#c84244', 
        borderRadius: 22,
        borderColor: '#6f0914',
        borderWidth: 1,
        borderStyle: 'dashed',
        padding: 16,
        marginRight: 8,
        //margin: 8,
        width: '35%',
      },
    
      buttonCancel: {
        backgroundColor: '#c3c3c3', 
        borderRadius: 14,
        borderColor: '#3c3c3c',
        borderWidth: 1,
        borderStyle: 'dashed',
        padding: 9,
        margin: 8,
        width: '35%',
        position: 'relative',
      },
    
      buttonEdit: {
        backgroundColor: '#113c6b', 
        borderRadius: 22,
        borderColor: '#050a59',
        borderWidth: 3,
        borderStyle: 'solid',
        padding: 16,
        marginVertical: 8,
        alignItems: 'center',
        width: '45%',
      },
    
      buttonAdd: {
        backgroundColor: '#cdfdde', 
        borderRadius: 22,
        borderColor: '#bbbbbb',
        borderWidth: 1,
        borderStyle: 'dotted',
        padding: 16,
        marginVertical: 8,
        alignItems: 'center',
        width: '55%',
        alignSelf: 'center',
        // Shadow for iOS + android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },

      buttonSave: {
        backgroundColor: '#186b11', 
        borderRadius: 14,
        borderColor: '#0f4f1a',
        borderWidth: 1,
        borderStyle: 'dashed',
        padding: 9,
        marginRight: 8,
        margin: 8,
        width: '35%',
      },

      buttonPage: {
        backgroundColor: '#d0d0d0', 
        borderRadius: 22,
        padding: 12,
        marginVertical: 8,
        alignItems: 'center',
        width: '30%',
      },
    
      buttonSetup: {
        backgroundColor: '#8bb1e7', 
        borderRadius: 22,
        padding: 12,
        borderColor: '#0f4f1a',
        borderWidth: 1,
        borderStyle: 'dashed',
        marginHorizontal: 8,
        alignItems: 'center',
        width: '100%',
      },
      
      buttonReset: {
        backgroundColor: '#d0d0d0', 
        borderRadius: 22,
        padding: 12,
        borderColor: '#0f4f1a',
        borderWidth: 1,
        borderStyle: 'dashed',
        marginHorizontal: 8,
        alignItems: 'center',
        width: '100%',
      },

    whiteBase14: {
        color: '#ffffff',
        fontSize: 14,
        textAlign: 'center',
    },

    whiteBase16: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },

    whiteBase20: {
      color: '#ffffff',
      fontSize: 20,
      textAlign: 'center',
  },

    whiteBase24: {
        color: '#ffffff',
        fontSize: 24,
        textAlign: 'center',
    },

    blackBase14: {
        color: '#000000',
        fontSize: 14,
        textAlign: 'center',
    },

    blackBase16: {
        color: '#000000',
        fontSize: 16,
        textAlign: 'center',
    },

    blackBase18: {
        color: '#000000',
        fontSize: 18,
        textAlign: 'center',
    },

    blackBase20: {
      color: '#000000',
      fontSize: 20,
      textAlign: 'center',
  },

    blackBase24: {
        color: '#000000',
        fontSize: 24,
        textAlign: 'center',
    },

});

export default GlobalButtons;