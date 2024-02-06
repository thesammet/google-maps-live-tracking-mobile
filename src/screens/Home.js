import React, { useState, useRef } from 'react'
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import imagePath from '../constants/imagePath';
import { GOOGLE_MAP_KEY } from '../constants/keys';

const { width, height } = Dimensions.get('window');

export default function Home({ navigation }) {
    const [state, setState] = useState(
        {
            pickupCoords: {
                latitude: 39.9359739,
                longitude: 32.8477795,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            dropLocationCoords: {
                latitude: 39.97100310,
                longitude: 33.11711860,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        }
    )
    const updateState = (data) => setState((state) => ({ ...state, ...data }));


    const mapRef = useRef()
    const { pickupCoords, dropLocationCoords } = state
    const onPressLocation = () => {
        navigation.navigate('ChooseLocation', { getCoordinates: fetchValue })
    }

    const fetchValue = (data) => {
        console.log("this is data", data)
        updateState({
            destinationCords: {
                latitude: data.destinationCords.latitude,
                longitude: data.destinationCords.longitude,
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFill}
                    initialRegion={pickupCoords}
                >
                    <Marker
                        coordinate={pickupCoords}
                        image={imagePath.icCurLoc} />
                    <Marker
                        coordinate={dropLocationCoords}
                        image={imagePath.icGreenMarker} />
                    <MapViewDirections
                        origin={pickupCoords}
                        destination={dropLocationCoords}
                        apikey={GOOGLE_MAP_KEY}
                        strokeWidth={5}
                        strokeColor={"cyan"}
                        optimizeWaypoints={true}
                        onReady={result => {
                            mapRef.current.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    right: (width / 20),
                                    bottom: (height / 20),
                                    left: (width / 20),
                                    top: (height / 20),
                                }
                            })
                        }}
                        onError={(errorMessage) => {
                            console.log("Got an error: " + errorMessage)
                        }}
                    />
                </MapView>
            </View>
            <View style={styles.bottomCard}>
                <Text>Find your path</Text>
                <TouchableOpacity
                    style={styles.inputStyle}
                    onPress={onPressLocation}>
                    <Text>Choose your location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.inputStyle}
                    onPress={onPressLocation}>
                    <Text>Choose your destination</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomCard: {
        backgroundColor: 'white',
        width: '100%',
        padding: 30,
        borderTopEndRadius: 24,
        borderTopStartRadius: 24
    },
    inputStyle: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        height: 48,
        justifyContent: 'center',
        marginTop: 16,
        fontSize: 24
    }
})