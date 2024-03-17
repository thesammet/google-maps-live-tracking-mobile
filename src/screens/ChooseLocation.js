//import libraries
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

//reusable components
import AddressPickup from '../components/AddressPickup';
import CustomBtn from '../components/CustomBtn';
import { showError, showSuccess } from '../utils/helperFunction';

const ChooseLocation = (props) => {
    const navigation = useNavigation()

    const [state, setState] = useState({
        pickupCoords: {},
        dropLocationCoords: {}
    })

    const { pickupCoords, dropLocationCoords } = state
    const checkValid = () => {
        if (Object.keys(pickupCoords).length === 0) {
            showError('Please enter your pickup location!')
            return false;
        }
        if (Object.keys(dropLocationCoords).length === 0) {
            showError('Please enter your drop location!')
            return false;
        }
        showSuccess("Successfully directed!")
        return true;
    }

    const onDone = () => {
        const isValid = checkValid()
        if (isValid) {
            props.route.params.getCoordinates({
                pickupCoords,
                dropLocationCoords
            })
            navigation.goBack()
        }
    }

    const fetchAddressCoords = (lat, lng) => {
        setState({
            ...state,
            pickupCoords: {
                latitude: lat,
                longitude: lng
            }
        })
    }

    const fetchDestinationCoords = (lat, lng) => {
        setState({
            ...state,
            dropLocationCoords: {
                latitude: lat,
                longitude: lng
            }
        })
    }

    console.log(JSON.stringify(props))

    return (
        <View style={styles.container}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: 'white', flex: 1, padding: 24 }}
            >
                <View style={{ marginBottom: 16 }} />
                <AddressPickup
                    placheholderText="Enter Destination Location"
                    fetchAddress={fetchAddressCoords}
                />
                <AddressPickup
                    placheholderText="Enter Destination Location"
                    fetchAddress={fetchDestinationCoords}
                />
                <CustomBtn
                    btnText="Done"
                    onPress={onDone}
                    btnStyle={{ marginTop: 24 }}
                />
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});
export default ChooseLocation;