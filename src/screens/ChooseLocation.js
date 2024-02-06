//import libraries
import { useNavigation } from '@react-navigation/native';
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

//reusable components
import AddressPickup from '../components/AddressPickup';
import CustomBtn from '../components/CustomBtn';

const ChooseLocation = (props) => {
    const navigation = useNavigation()

    const [state, setState] = useState({
        destinationCoords: {}
    })

    const { destinationCoords } = state

    const checkValid = () => {
        if (Object.keys(destinationCoords).length === 0) {
            console.log('Please enter your destination location')
            return false
        }
        return true
    }

    const onDone = () => {
        const isValid = checkValid()
        if (isValid) {
            props.route.params.getCordinates({
                destinationCoords
            })
            navigation.goBack()
        }
    }
    const fetchDestinationCoords = (lat, lng, zipCode, cityText) => {
        console.log("zip code==>>>", zipCode)
        console.log('city texts', cityText)
        setState({
            ...state,
            destinationCords: {
                latitude: lat,
                longitude: lng
            }
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: 'white', flex: 1, padding: 24 }}
            >
                <View style={{ marginBottom: 16 }} />
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