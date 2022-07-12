import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Linking, Alert, FlatList, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Image } from 'react-native-elements';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import theme from '../../../../styles/theme';
import global from '../../../../styles/global';
import styles from './style';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-6668134571203040/9018321883';

const CourtModal = ({ court, unsetCourt, handleUnsaveCourt, handleGetPlaceDetails, handleSaveCourt, isCourtSaved }) => {
  const openExternalMap = ({ coords }) => {
    const url = `http://maps.apple.com/?daddr=${coords.latitude},${coords.longitude}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Unable to open Map', 'Please check your connection or try again later.')
    );
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [placeDetails, setPlaceDetails] = useState({});
  const scrollViewRef = useRef();

  useEffect(async () => {
    if (court && court.id) {
      const detailsResponse = await handleGetPlaceDetails(court.id);
      setPlaceDetails(detailsResponse);
      setModalVisible(true);
    }
  }, [court]);

  const handleScrollTo = ({ x }) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({ offset: x, animated: true });
    }
  };
  const handleSwipeComplete = () => {
    setModalVisible(false);
    unsetCourt();
  };


  return (
    <Modal
      style={global.modal}
      isVisible={modalVisible}
      swipeDirection="down"
      backdropOpacity={0.25}
      onSwipeComplete={handleSwipeComplete}
      hideModalContentWhileAnimating
      scrollHorizontal
      propagateSwipe
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
    >
      <View style={global.modalContainer}>
        <FontAwesome5
          style={global.modalGrip}
          name="angle-down"
          size={28}
          color={theme.colors.darkGray}
        />
        <View style={global.modalHeader}>
          <View>
            <Text style={global.modalHeaderText}>{court.name}</Text>
            {placeDetails.address && <Text style={global.secondaryLabel}>{placeDetails.address}</Text>}
          </View>
        </View>
        <View style={global.modalContent}>
          <View style={styles.actionBtnRow}>
            <Button
              title="Directions"
              onPress={() => openExternalMap(court)}
              buttonStyle={styles.directionsBtn}
            />
            <Button
              type="clear"
              title={isCourtSaved ? 'Saved' : 'Save'}
              buttonStyle={styles.saveBtn}
              titleStyle={styles.saveBtnTitle}
              onPress={() => (isCourtSaved ? handleUnsaveCourt(court.id) : handleSaveCourt(court))}
              icon={
                <FontAwesome5
                  solid={Boolean(isCourtSaved)}
                  name="heart"
                  size={28}
                  color={theme.colors.heart}
                />
              }
            />
          </View>
          {placeDetails.photoUrls && placeDetails.photoUrls.length > 0 && (
            <View>
              <Text style={global.sectionLabel}>{`Photos (${placeDetails.photoUrls.length})`}</Text>
              <FlatList
                ref={scrollViewRef}
                data={placeDetails.photoUrls}
                keyExtractor={(item) => item}
                removeClippedSubviews
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.courtImage} />
                )}
                horizontal
                scrollEventThrottle={16}
                onScroll={(event) => {
                  setScrollOffset(event.nativeEvent.contentOffset.x);
                }}
              />
            </View>
          )}
        </View>
          <SafeAreaView style={global.adBanner}>
          <BannerAd unitId={adUnitId} size={BannerAdSize.ADAPTIVE_BANNER} />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default CourtModal;
