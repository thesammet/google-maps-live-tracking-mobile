import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native'
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import imagePath from '../constants/imagePath';
import { GOOGLE_MAP_KEY } from '../constants/keys';
import { locationPermission, getCurrentLocation } from '../utils/helperFunction';

const { width, height } = Dimensions.get('window');

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function Home({ navigation }) {
    useEffect(() => {
        getLiveLocation()
    }, [])

    const getLiveLocation = async () => {
        const locPermissionDenied = await locationPermission()
        if (locPermissionDenied) {
            const { latitude, longitude, heading } = await getCurrentLocation()
            console.log("get live location after 4 second", heading)
            animate(latitude, longitude);
            updateState({
                heading: heading,
                curLoc: { latitude, longitude },
                coordinate: new AnimatedRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                })
            })
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getLiveLocation()
        }, 6000);
        return () => clearInterval(interval)
    }, [])

    const [state, setState] = useState(
        {
            curLoc: {
                latitude: 39.9359739,
                longitude: 32.8477795,
            },
            dropLocationCoords: {
            },
            isLoading: false,
        }
    )

    const mapRef = useRef()
    const { curLoc, dropLocationCoords, isLoading } = state

    const fetchValue = (data) => {
        setState({
            ...state,
            dropLocationCoords: {
                latitude: data.dropLocationCoords.latitude,
                longitude: data.dropLocationCoords.longitude
            }
        })
        console.log("Data: ", data)
    }

    const animate = (latitude, longitude) => {
        const newCoordinate = { latitude, longitude };
        if (Platform.OS == 'android') {
            if (markerRef.current) {
                markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
            }
        } else {
            coordinate.timing(newCoordinate).start();
        }
    }

    const onPressLocation = () => {
        navigation.navigate('ChooseLocation', { getCoordinates: fetchValue })
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFill}
                    initialRegion={{
                        ...curLoc,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }}
                >
                    <Marker
                        coordinate={curLoc}
                        image={imagePath.icCurLoc} />
                    {Object.keys(dropLocationCoords).length > 0 && (
                        <Marker
                            coordinate={dropLocationCoords}
                            image={imagePath.icGreenMarker}
                        />)}
                    {Object.keys(dropLocationCoords).length > 0 &&
                        <MapViewDirections
                            origin={curLoc}
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
                        />}
                </MapView>
            </View>
            <View style={styles.bottomCard}>
                <Text>Find your path</Text>
                <TouchableOpacity
                    style={styles.inputStyle}
                    onPress={onPressLocation}>
                    <Text>Choose location</Text>
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