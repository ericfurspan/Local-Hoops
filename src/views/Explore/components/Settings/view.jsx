import React, { useState, useRef } from 'react';
import { Pressable, Text, FlatList, View } from 'react-native';
import Modal from 'react-native-modal';
import { Divider, Slider, Avatar, Tooltip } from 'react-native-elements';
import { convertDistance } from 'geolib';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import theme from '../../../../styles/theme';
import global from '../../../../styles/global';
import { MIN_SEARCH_RADIUS, MAX_SEARCH_RADIUS } from '../../../../utils/constants';
import SavedCourtPreview from './components/SavedCourtPreview';
import styles from './style';

const Settings = ({
  currentUser,
  resetPosition,
  activeMapTypeIndex,
  onChangeMapType,
  mapTypes,
  searchRadius,
  logout,
  savedCourts,
  onPressSavedCourt,
  onChangeSearchRadius,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(null);
  const scrollViewRef = useRef();

  const handleScrollTo = ({ x }) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({ offset: x, animated: true });
    }
  };

  const handlePressSavedCourt = (court) => {
    setModalVisible(false);
    onPressSavedCourt(court);
  };

  const handleLogout = () => {
    setModalVisible(false);
    logout();
  };

  return (
    <View>
      <View style={styles.actionBtnContainer}>
        <Pressable style={global.iconButton} onPress={() => setModalVisible(true)}>
          <FontAwesome5 name="layer-group" size={18} color={theme.colors.darkGray} />
        </Pressable>
        <Pressable style={global.iconButton} onPress={resetPosition}>
          <FontAwesome5 name="location-arrow" size={18} color={theme.colors.darkGray} />
        </Pressable>
      </View>
      <Modal
        style={global.fullHeightModal}
        isVisible={modalVisible}
        swipeDirection="down"
        propagateSwipe
        scrollHorizontal
        hideModalContentWhileAnimating
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        onSwipeComplete={() => setModalVisible(false)}
      >
        <View style={global.fullHeightModalContainer}>
          <FontAwesome5
            style={global.modalGrip}
            name="angle-down"
            size={28}
            color={theme.colors.darkGray}
          />
          <View style={global.modalHeader}>
            <Text style={global.modalHeaderText}>Settings</Text>
            <Tooltip
              containerStyle={styles.accountTooltip}
              pointerColor={theme.colors.lightGray}
              popover={
                <Pressable style={global.row} onPress={handleLogout}>
                  <Text style={styles.logoutText}>Sign Out</Text>
                  <FontAwesome5 name="sign-out-alt" size={14} color={theme.colors.red} />
                </Pressable>
              }
            >
             {currentUser?.photoURL && (
              <Avatar rounded size="small" source={{ uri: currentUser.photoURL }} />
             )}
            </Tooltip>
          </View>
          <View style={global.modalContent}>
            <Text style={global.sectionLabel}>MAP VIEW</Text>
            <View style={styles.textContainer}>
              <FlatList
                ItemSeparatorComponent={() => <Divider style={global.divider} />}
                data={mapTypes}
                removeClippedSubviews
                keyExtractor={(item) => item.name}
                renderItem={({ item, index }) => (
                  <Pressable style={styles.mapTypeRow} onPress={() => onChangeMapType(item.index)}>
                    <Text style={global.label}>{item.displayName}</Text>
                    {activeMapTypeIndex === index && (
                      <FontAwesome5 name="check" size={18} color={theme.colors.blue} />
                    )}
                  </Pressable>
                )}
              />
            </View>
            <Divider style={global.spacedDivider} />
            <Text style={global.sectionLabel}>SEARCH RADIUS</Text>
            <View style={[styles.textContainer, global.padding]}>
              <Text style={global.label}>{`${searchRadius} meters (${convertDistance(
                searchRadius,
                'mi'
              ).toPrecision(2)} miles)`}</Text>
            </View>
            <Slider
              value={searchRadius}
              step={100}
              minimumValue={MIN_SEARCH_RADIUS}
              maximumValue={MAX_SEARCH_RADIUS}
              onValueChange={onChangeSearchRadius}
              thumbStyle={styles.sliderTrackThumb}
            />
            <Divider style={global.spacedDivider} />
            <Text style={global.sectionLabel}>SAVED COURTS</Text>
            <FlatList
              ref={scrollViewRef}
              data={savedCourts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SavedCourtPreview item={item} onPressItem={handlePressSavedCourt} />
              )}
              horizontal
              scrollEventThrottle={16}
              onScroll={(event) => {
                setScrollOffset(event.nativeEvent.contentOffset.x);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Settings;
