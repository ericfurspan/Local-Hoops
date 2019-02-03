import React from 'react';
import { Button } from 'react-native-elements';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { findLocationByQuery } from '../../api-calls/googleplaces';
import { MAPBOX_ACCESS_TOKEN } from '../../../config';
import styles from '../styles/main';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

class PinToMap extends React.Component {
    state = {
        center: {
            lat: this.props.userLocation.latitude,
            long: this.props.userLocation.longitude
        },
        searchText: null
    }
    updateCenterCoords = (lat, long) => {
        this.setState({
            center: {
                lat,
                long
            }
        })
    }
    updateUserLocationByQuery = () => {
         findLocationByQuery(this.state.searchText, this.updateCenterCoords)
    }
    updateSearchText = (e) => {
        this.setState({
            searchText: e
        })
    }   
    returnAnnotation = (coords) => {
        
        return (
            <Mapbox.PointAnnotation
                key={"1"}
                id={"1"}
                coordinate={[coords.long, coords.lat]}
                title="annotation title"
            >
            </Mapbox.PointAnnotation>
        )  
    }   
    
    render() {
        return (       
                <Mapbox.MapView
                    styleURL={Mapbox.StyleURL.Light}
                    zoomLevel={15}
                    ref={(c) => this._map = c}
                    centerCoordinate={[this.state.center.long, this.state.center.lat]}
                    showUserLocation={false}
                    style={styles.container}
                    onRegionDidChange={(e) => this.updateCenterCoords(e.geometry.coordinates[1],e.geometry.coordinates[0])}
                >
                    {this.returnAnnotation(this.state.center)}
                    <SearchBar
                        lightTheme
                        containerStyle={{backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
                        onChangeText={(e) => this.updateSearchText(e)}
                        inputStyle={{color: '#333'}}
                        onSubmitEditing={() => this.updateUserLocationByQuery()}
                        placeholder='Search Location...' 
                    />
                <Button 
                    title='SELECT THIS LOCATION'
                    onPress={() => {
                        this.props.onCancel;
                        this.props.onPinSelect(this.state.center);
                    }}
                    buttonStyle={{backgroundColor: '#3578E5', borderColor: '#F6F8FA', borderWidth: 1, borderRadius: 10}}
                />
                </Mapbox.MapView>    
            )
        }
    }

const mapStateToProps = (state) => ({
    userLocation: state.currentUser.location,
})
  
export default connect(mapStateToProps)(PinToMap);



