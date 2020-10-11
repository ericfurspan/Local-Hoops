import React, { useState, useRef } from 'react';
import { View, Text, Linking, Alert, FlatList, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Image } from 'react-native-elements';
import { Marker, Callout, CalloutSubview } from 'react-native-maps';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import theme from '../../../../styles/theme';
import global from '../../../../styles/global';
import styles from './style';

const MapMarkers = ({
  courts,
  handleSaveCourt,
  handleUnsaveCourt,
  savedCourtIds,
  setCamera,
  unsetCamera,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(null);
  const scrollViewRef = useRef();

  const handleMarkerPress = async (coords) => {
    await setCamera(coords);
    setModalVisible(true);
  };

  const handleMarkerClose = () => {
    unsetCamera();
    setModalVisible(false);
  };

  const openExternalMap = ({ coords }) => {
    const url = `http://maps.apple.com/?daddr=${coords.latitude},${coords.longitude}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Unable to open Map', 'Please check your connection or try again later.')
    );
  };

  const handleScrollTo = ({ x }) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({ offset: x, animated: true });
    }
  };

  const isCourtSaved = (courtId) => savedCourtIds.includes(courtId);

  return courts.map((court) => (
    <Marker
      key={court.id}
      identifier={court.id}
      coordinate={court.coords}
      pinColor={isCourtSaved(court.id) ? theme.colors.gold : theme.colors.red}
      onPress={() => handleMarkerPress(court.coords)}
    >
      {isCourtSaved(court.id) && (
        <FontAwesome5 name="star" solid size={21} color={theme.colors.gold} />
      )}
      <Callout tooltip alphaHitTest>
        <Modal
          style={global.modal}
          isVisible={modalVisible}
          swipeDirection="down"
          backdropOpacity={0.25}
          onSwipeComplete={handleMarkerClose}
          scrollHorizontal
          propagateSwipe
          hideModalContentWhileAnimating
          scrollTo={handleScrollTo}
          scrollOffset={scrollOffset}
        >
          <CalloutSubview style={global.modalContainer}>
            <FontAwesome5
              style={global.modalGrip}
              name="angle-down"
              size={28}
              color={theme.colors.darkGray}
            />
            <View style={global.modalHeader}>
              <View>
                <Text style={global.modalHeaderText}>{court.name}</Text>
                {court.address && <Text style={global.secondaryLabel}>{court.address}</Text>}
              </View>
            </View>
            <View style={styles.actionBtnRow}>
              <Button
                title="Directions"
                onPress={() => openExternalMap(court)}
                buttonStyle={styles.directionsBtn}
              />
              <Button
                type="clear"
                title={isCourtSaved(court.id) ? 'Saved' : 'Save'}
                buttonStyle={styles.saveBtn}
                titleStyle={styles.saveBtnTitle}
                onPress={() =>
                  isCourtSaved(court.id) ? handleUnsaveCourt(court.id) : handleSaveCourt(court)
                }
                icon={
                  <FontAwesome5
                    solid={isCourtSaved(court.id)}
                    name="heart"
                    size={28}
                    color={theme.colors.heart}
                  />
                }
              />
            </View>
            {court.photoUrls && court.photoUrls.length > 0 && (
              <SafeAreaView>
                <Text style={global.sectionLabel}>{`Photos (${court.photoUrls.length})`}</Text>
                <FlatList
                  ref={scrollViewRef}
                  data={court.photoUrls}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.courtImage} />
                  )}
                  horizontal
                  scrollEventThrottle={16}
                  onScroll={(event) => {
                    setScrollOffset(event.nativeEvent.contentOffset.x);
                  }}
                />
              </SafeAreaView>
            )}
          </CalloutSubview>
        </Modal>
      </Callout>
    </Marker>
  ));
};

export default MapMarkers;
