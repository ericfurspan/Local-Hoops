import React, { useState, useRef } from 'react';
import { Text, View, FlatList, Pressable, Switch, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { convertDistance, getDistance } from 'geolib';
import { Divider } from 'react-native-elements';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import theme from '../../../../styles/theme';
import global from '../../../../styles/global';
import { ADMOB_SEARCHRESULTS_ADUNIT_ID } from '../../../../../config';

const adUnitId = __DEV__ ? TestIds.BANNER : ADMOB_SEARCHRESULTS_ADUNIT_ID;

const SearchResults = ({
  nearbyCourts,
  usedRadius,
  usedCoords,
  isVisible,
  onPressCourt,
  onHide,
}) => {
  const [scrollOffset, setScrollOffset] = useState(null);
  const [useDistanceSort, setUseDistanceSort] = useState(false);
  const scrollViewRef = useRef();

  const handleScrollTo = ({ y }) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({ offset: y, animated: true });
    }
  };

  const sortByDistance = (a, b) => {
    const distanceFromA = getDistance(
      { latitude: a.coords.latitude, longitude: a.coords.longitude },
      { latitude: usedCoords.latitude, longitude: usedCoords.longitude }
    );
    const distanceFromB = getDistance(
      { latitude: b.coords.latitude, longitude: b.coords.longitude },
      { latitude: usedCoords.latitude, longitude: usedCoords.longitude }
    );

    if (distanceFromA < distanceFromB) {
      return -1;
    }
    if (distanceFromA > distanceFromB) {
      return 1;
    }
    return 0;
  };

  const sortByName = (a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }
    return 0;
  };

  return (
    <Modal
      style={global.fullHeightModal}
      isVisible={isVisible}
      swipeDirection="down"
      onSwipeComplete={onHide}
      propagateSwipe
      hideModalContentWhileAnimating
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
    >
      <View style={global.fullHeightModalContainer}>
        <FontAwesome5
          style={global.modalGrip}
          name="angle-down"
          size={28}
          color={theme.colors.darkGray}
        />
        <View style={global.modalHeader}>
          <View>
            <Text style={global.modalHeaderText}>Search Results</Text>
            <Text style={global.secondaryLabel}>{`${
              nearbyCourts.length
            } courts found within ${convertDistance(usedRadius, 'mi').toPrecision(2)} miles`}</Text>
          </View>
        </View>
        <View style={global.row}>
          <Text
            style={[
              global.secondaryLabel,
              global.spaceRight,
              { color: useDistanceSort ? theme.colors.blue : theme.colors.gray },
            ]}
          >
            Sort by Distance
          </Text>
          <Switch
            trackColor={{ false: theme.colors.darkGray, true: theme.colors.blue }}
            onValueChange={() => setUseDistanceSort(!useDistanceSort)}
            value={useDistanceSort}
          />
        </View>
        <FlatList
          data={nearbyCourts.sort(useDistanceSort ? sortByDistance : sortByName)}
          ref={scrollViewRef}
          style={global.spaceVertical}
          scrollEventThrottle={16}
          onScroll={(event) => {
            setScrollOffset(event.nativeEvent.contentOffset.y);
          }}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider style={global.divider} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => onPressCourt(item)} style={global.padding}>
              <Text style={global.bodyText}>{item.name}</Text>
              <Text style={global.secondaryLabel}>{item.address}</Text>
            </Pressable>
          )}
        />
        <SafeAreaView style={global.adBanner}>
          <BannerAd unitId={adUnitId} size={BannerAdSize.ADAPTIVE_BANNER} />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default SearchResults;
