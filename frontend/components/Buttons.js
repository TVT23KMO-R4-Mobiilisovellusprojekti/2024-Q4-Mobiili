import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import GlobalButtons from '../assets/styles/GlobalButtons';

export const ButtonContinue = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={[GlobalButtons.buttonBase, GlobalButtons.buttonContinue]} 
      onPress={onPress}
    >
      <Text style={[GlobalButtons.whiteBase, GlobalButtons.size24]}>{title}</Text>
    </TouchableOpacity>
  );
};

//Käyttäjänimenvaihto
export const ButtonChange = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={[GlobalButtons.buttonBase, GlobalButtons.buttonChange]} 
      onPress={onPress} 
    >
      <Text style={[GlobalButtons.whiteBase, GlobalButtons.size16]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonNavigate = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={[GlobalButtons.buttonNavigate]} 
      onPress={onPress}
    >
      <Text style={[GlobalButtons.blackBase, GlobalButtons.size18]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonDelete = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={[GlobalButtons.buttonBase, GlobalButtons.buttonDelete]}
      onPress={onPress}
    >
      <Text style={[GlobalButtons.whiteBase, GlobalButtons.size16]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonConfirm = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={[GlobalButtons.buttonBase, GlobalButtons.buttonConfirm]} 
      onPress={onPress} 
    >
      <Text style={[GlobalButtons.whiteBase, GlobalButtons.size16]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonCancel = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={[GlobalButtons.buttonBase, GlobalButtons.buttonCancel]} 
      onPress={onPress} 
    >
      <Text style={[GlobalButtons.blackBase, GlobalButtons.size16]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonEdit = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={[GlobalButtons.buttonBase, GlobalButtons.buttonEdit]}
      onPress={onPress} 
    >
      <Text style={[GlobalButtons.whiteBase, GlobalButtons.size16]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonAdd = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={[GlobalButtons.buttonBase, GlobalButtons.buttonAdd]} 
      onPress={onPress}
    >
      <Text style={[GlobalButtons.whiteBase, GlobalButtons.size16]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonSave = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={[GlobalButtons.buttonBase, GlobalButtons.buttonSave]} 
      onPress={onPress} 
    >
      <Text style={[GlobalButtons.whiteBase, GlobalButtons.size16]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonPage = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[
        GlobalButtons.buttonPage, 
        disabled ? { opacity: 0.5 } : {}
      ]}
      onPress={onPress}
      disabled={disabled}  
    >
      <Text style={[GlobalButtons.blackBase, GlobalButtons.size14]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const ButtonSetup = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={[GlobalButtons.buttonBase, GlobalButtons.buttonSetup]} 
      onPress={onPress} 
    >
      <Text style={[GlobalButtons.blackBase, GlobalButtons.size16]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonReset = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={[GlobalButtons.buttonBase, GlobalButtons.buttonReset]} 
      onPress={onPress} 
    >
      <Text style={[GlobalButtons.blackBase, GlobalButtons.size16]}>{title}</Text>
    </TouchableOpacity>
  );
};
