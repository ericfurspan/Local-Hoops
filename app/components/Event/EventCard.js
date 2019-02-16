import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Avatar, Card, Icon } from 'react-native-elements';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { MAPBOX_ACCESS_TOKEN } from '../../../config';
import styles from '../styles/main';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

let deviceHeight= Dimensions.get('window').height;

const returnAnnotation = (coords) => {
  return (
    <Mapbox.PointAnnotation
      key={"2"}
      id={"2"}
      coordinate={[coords.long, coords.lat]}
      title="annotation title"
    >
    </Mapbox.PointAnnotation>
  )
}

export default function EventCard(props) {
  return (
    <Card
      containerStyle={styles.cardContainer}
    >
      <View style={styles.spaceBetweenRow}>
        <Icon
          name='ios-settings'
          color='#3578E5'
          type='ionicon'
          size={30}
        />
        <Icon
          name='ios-time'
          color='#3578E5'
          type='ionicon'
          size={30}
        />
      </View>
      <View style={[styles.spaceBetweenRow,{marginBottom: 30}]}>
        <Text>{props.event.type}</Text>
        <Text>{props.event.date}</Text>
      </View>
      <View style={styles.spaceBetweenRow}>
        <Icon
          name='ios-people'
          color='#3578E5'
          type='ionicon'
          size={30}
        />
        <Icon
          name='ios-quote'
          color='#3578E5'
          type='ionicon'
          size={30}
        />
      </View>
      <View style={[styles.spaceBetweenRow,{marginBottom: 30}]}>
        <View style={{flexDirection: 'row',justifyContent: 'flex-start'}}>
          {props.event.participants.map((p,i) => {
            return (
              <Avatar
                size='small'
                rounded
                source={{uri: p.photoURL}}
                activeOpacity={0.7}
                containerStyle={{margin: 5}}
                key={i}
              />
            )
          })}
        </View>
        <View>
          <Text>{props.event.comment}</Text>
        </View>
      </View>

      <View style={[styles.spaceBetweenRow,{height: deviceHeight*.20}]}>
        <Mapbox.MapView
          styleURL={Mapbox.StyleURL.Light}
          zoomLevel={15}
          centerCoordinate={[props.event.court.long, props.event.court.lat]}
          showUserLocation={false}
          style={{flex: 1}}
          logoEnabled={false}
        >
          {returnAnnotation({lat: props.event.court.lat, long: props.event.court.long})}
        </Mapbox.MapView>
      </View>

    </Card>
  )
}