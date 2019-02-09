import React from 'react';
import { Text, View, Dimensions, AlertIOS } from 'react-native';
import { Button, Input, Header } from 'react-native-elements';
import { connect } from 'react-redux';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { clearTempEvent } from '../../../actions/Event'
import styles from '../../styles/main';
import { saveCourt } from '../../../actions/Court';
import { MAPBOX_ACCESS_TOKEN } from '../../../../config';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

class SaveCourt extends React.Component {  
    state = {
        textDisabled: true
    }
    onTextChange = (val) => {
        if(val.length > 1) {
            this.setState({textDisabled:false},() => {
                this.props.updateName({court_name: val});
            })
        } else {
            this.setState({textDisabled:true})
        }
    }
    returnAnnotation = (coords) => { 
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
    confirmSaveCourt = () => {
        AlertIOS.alert(
            'Save Court',
            `Are you sure you want to save this court?`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                    this.props.dispatch(saveCourt({
                        lat: this.props.court.lat,
                        long: this.props.court.long,
                        name: this.props.court.court_name
                    }))
                    this.props.close()      
                    this.props.dispatch(clearTempEvent());      
              }}
            ]
          );
    }
    render() {
        return (
            <View style={styles.centeredContainer}>
                <Header
                    centerComponent={{ text: 'Save this Court', style: { color: '#FFFFFF', fontSize:26 } }}
                    rightComponent={
                        <Text 
                            onPress={() => {
                                this.props.close()
                                this.props.dispatch(clearTempEvent());      
                            }}
                            style={{color:'#FFFFFF',fontSize:20}}
                        >Skip</Text>
                    }
                    containerStyle={styles.headerContainer}
                />
                <View style={{height:deviceHeight*.20, width: deviceWidth*.98}}>                
                    <Mapbox.MapView
                        styleURL={Mapbox.StyleURL.Light}
                        zoomLevel={15}
                        centerCoordinate={[this.props.court.long, this.props.court.lat]}
                        showUserLocation={false}
                        style={{flex: 1}}
                    >
                        {this.returnAnnotation({lat: this.props.court.lat, long: this.props.court.long})}
                    </Mapbox.MapView> 
                </View>
                <Input 
                    placeholder='Enter a Name for this court'
                    onChangeText={ val => this.onTextChange(val)}
                    containerStyle={{width: 300, margin: 30}}
                    inputStyle={{color: '#444', marginLeft: 5}}
                />
                <Button 
                    title='SAVE'
                    onPress={() => this.confirmSaveCourt()}
                    icon={{name:'md-save',type:'ionicon',size:20,color:'#FFFFFF'}}
                    buttonStyle={styles.button}
                    disabled={this.state.textDisabled}
                />
            </View>
        )      
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.currentUser
})

export default connect(mapStateToProps)(SaveCourt);