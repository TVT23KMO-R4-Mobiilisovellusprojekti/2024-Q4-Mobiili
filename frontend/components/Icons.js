import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../assets/styles/Styles.js';


export const IconTrash = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="trash-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconSettings = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="settings-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconClose = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="close-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconOpen = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="open-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconSearch = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="search-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconAdd = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="add-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconRemove = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} >
            <Icon name="remove-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconReader = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="reader-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconEdit = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="create-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconCheckmark = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="checkmark-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconCancel = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="close-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconBack = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="arrow-back" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconForward = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="arrow-forward" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconMenu = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="menu-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconHome = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="home-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconPerson = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="person-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconList = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="list-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconChat = ({ onPress, disabled }) => {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            style={[globalStyles.iconButton, disabled && globalStyles.disabledButton]} 
            disabled={disabled} 
        >
            <Icon name="chatbox-ellipses-outline" style={[globalStyles.iconStyle, disabled && { color: '#ccc' }]} />
        </TouchableOpacity>
    );
};

export const IconNewDocument = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="create-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconLocation = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="location-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconMyItemList = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="layers-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
};

export const IconMyQueueList = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="checkmark-circle-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
}

export const IconLogout = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="log-out-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
}

export const IconRemoveUser = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="person-remove-outline" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
}

//saavutettavuus:
export const IconPlusFontSize = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="format-annotation-plus" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
}
export const IconMinusFontSize = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[globalStyles.iconButton]}>
            <Icon name="format-annotation-minus" style={globalStyles.iconStyle} />
        </TouchableOpacity>
    );
}