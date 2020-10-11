import React, { useState, useEffect, useRef } from 'react';
import { Alert, View, SafeAreaView } from 'react-native';
import { Button, Badge } from 'react-native-elements';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SearchBar, MapMarkers, Settings, SearchResults } from './components';
import {
  mapTypes,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  DEFAULT_CAMERA,
  DEFAULT_SEARCH_RADIUS,
} from '../../utils/constants';
import theme from '../../styles/theme';
import styles from './style';

const Explore = ({
  nearbyCourts,
  getNearbyCourts,
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
  const [selectedMarker, setSelectedMarker] = useState();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [nextRegionCoords, setNextRegionCoords] = useState();
  const mapRef = useRef();

  useEffect(() => {
    if (!initialRegion.latitude) {
      Geolocation.getCurrentPosition(
        (position) => {
          setInitialRegion({
            ...initialRegion,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          getCourtsAtCoords(position.coords, searchRadius);
        },
        (_error) => {
          Alert.alert('Heads up!', 'You must enable location services to use this application.');
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
    }
    if (savedCourts.length === 0) {
      getSavedCourts(currentUser.saved_courts);
    }
  });

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

    if (nextCoords.latitude === initialRegion.latitude) {
      getCourtsAtCoords({ latitude: initialRegion.latitude, longitude: initialRegion.longitude });
    } else {
      setNextRegionCoords(nextCoords);
    }
  };

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

  const handleUnsetCamera = () => {
    setSelectedMarker(null);
    mapRef.current.animateCamera({ altitude: 10000 }, { duration: 1000 });
  };

  const allMarkers = [...nearbyCourts, ...savedCourts];
  const allUniqueMarkers = [...new Set(allMarkers.map(({ id }) => id))].map((e) =>
    allMarkers.find(({ id }) => id === e)
  );

  if (initialRegion.latitude) {
    return (
      <SafeAreaView style={styles.container}>
        <MapView
          ref={mapRef}
          mapType={mapType.name}
          style={styles.absoluteFill}
          showsUserLocation
          showsCompass={false}
          initialRegion={initialRegion}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          <MapMarkers
            courts={allUniqueMarkers}
            handleSaveCourt={handleSaveCourt}
            handleUnsaveCourt={handleUnsaveCourt}
            savedCourtIds={savedCourts.map((court) => court.id)}
            setCamera={handleSetCamera}
            unsetCamera={handleUnsetCamera}
            selectedMarker={selectedMarker}
          />
        </MapView>

        <View style={styles.mapHeaderRow}>
          <SearchBar onSubmit={handleTextSearch} />
        </View>

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
        {(nextRegionCoords || loading) && !showSearchResults && (
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
      </SafeAreaView>
    );
  }

  return null;
};

export default Explore;
