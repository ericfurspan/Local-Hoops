import React from 'react';
import { View, Text, StyleSheet, PlatformColor } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { mapTypes, DEFAULT_CAMERA } from '../../../../../utils/constants';
import theme from '../../../../../styles/theme';

const SavedCourtPreview = ({ item, onPressItem }) => (
  <View key={item.id} style={styles.mapContainer}>
    <MapView
      mapType={mapTypes[0].name}
      style={styles.map}
      scrollEnabled={false}
      camera={{ ...DEFAULT_CAMERA, center: { ...item.coords } }}
      onPress={() => onPressItem(item)}
    >
      <Marker coordinate={item.coords}>
        <FontAwesome5 name="star" solid size={24} color={theme.colors.gold} />
      </Marker>
    </MapView>
    <Text style={styles.label} numberOfLines={1}>
      {item.name}
    </Text>
  </View>
);

export default SavedCourtPreview;

const styles = StyleSheet.create({
  mapContainer: {
    width: 150,
    marginRight: 4,
  },
  map: {
    height: 125,
  },
  label: {
    color: PlatformColor('label'),
    fontSize: 16,
    margin: 4,
    fontWeight: '500',
  },
});
