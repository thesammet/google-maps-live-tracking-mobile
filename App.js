import React, { useState, useRef } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAP_KEY } from './src/constants/keys';

const { width, height } = Dimensions.get('window');

export default function App() {
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

  const mapRef = useRef()
  const { pickupCoords, dropLocationCoords } = state

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={pickupCoords}
      >
        <Marker coordinate={pickupCoords} />
        <Marker coordinate={dropLocationCoords} />
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
        />
      </MapView>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})