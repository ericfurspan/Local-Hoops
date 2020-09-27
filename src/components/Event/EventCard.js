import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Card, Icon } from 'react-native-elements';
// import Mapbox from '@react-native-mapbox-gl/maps';
// import { MAPBOX_ACCESS_TOKEN } from '../../../config';
import styles from '../../styles/main';

// Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const deviceHeight = Dimensions.get('window').height;

const returnAnnotation = (coords) => {
  return (
    null
    // <Mapbox.PointAnnotation
    //   key="2"
    //   id="2"
    //   coordinate={[coords.longitude, coords.latitude]}
    //   title="annotation title"
    // ></Mapbox.PointAnnotation>
  );
};

export default function EventCard(props) {
  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.spaceBetweenRow}>
        <Icon name="cogs" color="#3578E5" type="font-awesome" size={40} />
        <Text style={styles.text}>{props.event.type}</Text>
      </View>
      <View style={styles.spaceBetweenRow}>
        <Icon name="clock" color="#3578E5" type="font-awesome" size={40} />
        <Text style={styles.text}>{props.event.date}</Text>
      </View>
      <View style={styles.spaceBetweenRow}>
        <Icon name="users" color="#3578E5" type="font-awesome" size={40} />
        <View style={styles.centeredRow}>
          {props.event.participants.map((p, i) => {
            return (
              <Avatar
                size="small"
                rounded
                source={{ uri: p.photoURL }}
                activeOpacity={0.7}
                containerStyle={{ margin: 5 }}
                key={i}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.spaceBetweenRow}>
        <Icon name="comment" color="#3578E5" type="font-awesome" size={40} />
        <Text style={[styles.text, { textAlign: 'right' }]}>{props.event.comment}</Text>
      </View>

      <TouchableOpacity
        style={[styles.spaceBetweenRow, { height: deviceHeight * 0.2 }]}
        onPress={() => {
          // navigate to this court in the Explore screen
          props.onClose(false);
          props.navigation.navigate('Explore', { action: { type: 'showCourt', data: props.event.court } });
        }}
      >
        {/* <Mapbox.MapView
          styleURL={Mapbox.StyleURL.Light}
          zoomLevel={15}
          centerCoordinate={[props.event.court.coords.longitude, props.event.court.coords.latitude]}
          showUserLocation={false}
          style={{ flex: 1 }}
          logoEnabled={false}
        >
          {returnAnnotation({
            latitude: props.event.court.coords.latitude,
            longitude: props.event.court.coords.longitude,
          })}
        </Mapbox.MapView> */}
      </TouchableOpacity>
      <Text style={[styles.text, { alignSelf: 'center', fontWeight: 'bold', marginTop: 15 }]}>
        {props.event.court.name}
      </Text>
    </Card>
  );
}
