import React, { useState, useEffect, useRef } from 'react';
import { Alert, View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { Button, Badge } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SearchBar, CourtModal, Settings, SearchResults } from './components';
import {
  mapTypes,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  DEFAULT_CAMERA,
  DEFAULT_SEARCH_RADIUS,
} from '../../utils/constants';
import theme from '../../styles/theme';
import global from '../../styles/global';
import styles from './style';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-6668134571203040/9808465859';

const Explore = ({
  nearbyCourts,
  getNearbyCourts,
  getPlaceDetails,
  clearNearbyCourts,
  getCoordsForQuery,
  getSavedCourts,
  savedCourts,
  currentUser,
  logout,
  saveCourt,
  unsaveCourt,
}) => {
  const [initialRegion, setInitialRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [searchRadius, setSearchRadius] = useState(DEFAULT_SEARCH_RADIUS);
  const [mapType, setMapType] = useState(mapTypes[0]);
  const [loading, setLoading] = useState(false);
  const [activeCourt, setActiveCourt] = useState();
  const [hasLocationError, setHasLocationError] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [nextRegionCoords, setNextRegionCoords] = useState();
  const mapRef = useRef();

  useEffect(() => {
    if (!currentUser) {
      return logout();
    }
  }, [ currentUser ]);

  useEffect(() => {
    if (!initialRegion.latitude) {
      Geolocation.getCurrentPosition(
        (position) => {
          setInitialRegion({
            ...initialRegion,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setHasLocationError(false);
          getCourtsAtCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          if (error.PERMISSION_DENIED === 1) {
            Geolocation.requestAuthorization();
          }
          setHasLocationError(true);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
      Geolocation.watchPosition(
        (newPosition) => {
          setInitialRegion({
            ...initialRegion,
            latitude: newPosition.coords.latitude,
            longitude: newPosition.coords.longitude,
          });
        },
        null,
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, useSignificantChanges: true }
      );
    } else if (savedCourts.length === 0) {
      getSavedCourts(currentUser.saved_courts);
    }
  }, [ initialRegion ]);

  const changeMapType = (index) => {
    const newMapType = mapTypes.find((_mapType) => index === _mapType.index);
    setMapType(newMapType);
  };

  const handleResetPosition = () => {
    mapRef.current.animateToRegion(initialRegion);

    const { latitude, longitude } = initialRegion;
    getCourtsAtCoords({ latitude, longitude });
  };

  const handleTextSearch = async (text) => {
    const nextCoords = text && (await getCoordsForQuery(text));

    if (nextCoords) {
      mapRef.current.animateToRegion({ ...initialRegion, ...nextCoords });
      await getCourtsAtCoords(nextCoords, searchRadius);
    } else {
      Alert.alert('Nothing Found', `Could not match any coordinates to the query: ${text}`);
    }
  };

  const getCourtsAtCoords = async (coords, radius = searchRadius) => {
    clearNearbyCourts();
    setNextRegionCoords(null);
    setLoading(true);
    await getNearbyCourts(coords, radius);
    setLoading(false);
  };

  const handleRegionChangeComplete = (nextRegion) => {
    const nextCoords = {
      longitude: nextRegion.longitude,
      latitude: nextRegion.latitude,
    };

    const isSignificantChange = nextRegion?.latitude?.toFixed(1) !== initialRegion?.latitude?.toFixed(1);
    if (isSignificantChange) {
      setNextRegionCoords(nextCoords);
    }
  };

  const handleGetPlaceDetails = (placeId) => getPlaceDetails(placeId);

  const handleSaveCourt = (court) => {
    saveCourt(currentUser.uid, court);
  };

  const handleUnsaveCourt = (courtId) => {
    unsaveCourt(currentUser.uid, courtId);
  };

  const handleSetCamera = async (coords) => {
    setShowSearchResults(false);

    const camera = {
      ...DEFAULT_CAMERA,
      center: { ...coords },
    };

    mapRef.current.animateCamera(camera, { duration: 1000 });
  };

  const handleUnsetCourt = () => {
    setActiveCourt(false);
    mapRef.current.animateCamera({ altitude: 10000 }, { duration: 1000 });
  };

  const isCourtSaved = (courtId) => savedCourts.map((court) => court.id).includes(courtId);

  const mergedCourts = [...nearbyCourts, ...savedCourts];
  const allCourts = [...new Set(mergedCourts.map(({ id }) => id))].map((e) =>
    mergedCourts.find(({ id }) => id === e)
  );

  if (initialRegion.latitude) {
    return (
      <>
        <SafeAreaView style={styles.container}>
          <MapView
            ref={mapRef}
            mapType={mapType.name}
            style={global.absoluteFill}
            showsUserLocation
            showsCompass={false}
            initialRegion={initialRegion}
            onRegionChangeComplete={handleRegionChangeComplete}
          >
            {allCourts.map((court) => (
              <Marker
                key={court.id}
                identifier={court.id}
                coordinate={court.coords}
                pinColor={isCourtSaved(court.id) ? theme.colors.gold : theme.colors.red}
                onPress={() => {
                  handleSetCamera(court.coords);
                  setActiveCourt(court);
                }}
              >
                {isCourtSaved(court.id) && (
                  <FontAwesome5 name="star" solid size={21} color={theme.colors.gold} />
                )}
              </Marker>
            ))}
          </MapView>

          {activeCourt && (
            <CourtModal
              court={activeCourt}
              unsetCourt={handleUnsetCourt}
              handleSaveCourt={handleSaveCourt}
              handleUnsaveCourt={handleUnsaveCourt}
              handleGetPlaceDetails={handleGetPlaceDetails}
              isCourtSaved={isCourtSaved(activeCourt.id)}
            />
          )}

          <SearchBar onSubmit={handleTextSearch} />

          {(nextRegionCoords || loading) && (
            <Button
              title="Search this area"
              loading={loading}
              loadingProps={{ size: 'small', color: theme.colors.blue }}
              titleStyle={styles.actionBtnTitle}
              containerStyle={styles.searchAgainContainer}
              buttonStyle={styles.actionBtn}
              onPress={() => getCourtsAtCoords(nextRegionCoords)}
            />
          )}

          <SearchResults
            nearbyCourts={nearbyCourts}
            isVisible={showSearchResults}
            usedRadius={searchRadius}
            usedCoords={initialRegion}
            onPressCourt={(court) => handleSetCamera(court.coords)}
            onHide={() => setShowSearchResults(false)}
          />

          {!showSearchResults && !loading && (
            <View style={styles.viewListContainer}>
              <Button
                title="List view"
                titleStyle={styles.actionBtnTitle}
                buttonStyle={styles.actionBtn}
                onPress={() => setShowSearchResults(true)}
                iconRight
                icon={
                  <FontAwesome5
                    name="list-ul"
                    size={16}
                    color={theme.colors.blue}
                    style={styles.actionBtnIcon}
                  />
                }
              />
              <Badge value={nearbyCourts.length} containerStyle={styles.actionBtnBadge} />
            </View>
          )}

          <Settings
            resetPosition={handleResetPosition}
            activeMapTypeIndex={mapType.index}
            onChangeMapType={changeMapType}
            searchRadius={searchRadius}
            savedCourts={savedCourts}
            mapTypes={mapTypes}
            currentUser={currentUser}
            logout={logout}
            onPressSavedCourt={(court) => handleSetCamera(court.coords)}
            onChangeSearchRadius={setSearchRadius}
          />
        </SafeAreaView>
        <SafeAreaView style={global.adBanner}>
          <BannerAd unitId={adUnitId} size={BannerAdSize.ADAPTIVE_BANNER} />
        </SafeAreaView>
      </>
    );
  }

  if (hasLocationError) {
    return (
      <SafeAreaView style={global.centered}>
        <FontAwesome5 name="exclamation-triangle" size={32} color={theme.colors.blue} />
        <Text style={[global.bodyText, global.textCenter, global.padding]}>
          Please enable location services
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.blue} style={global.spinner} />
    </SafeAreaView>
  );
};

export default Explore;
