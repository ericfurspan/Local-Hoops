import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { List, ListItem, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { Cancel } from '../navButtons';
import PinToMap from './PinToMap';
import { updateUserLoc } from '../../actions/User';
import styles from '../styles/main';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

const selectTypes = [ {val: 'Pin to Map', key: 'pin'}, {val: 'Select from Saved Courts', key: 'saved'}, {val: 'Use my current location', key: 'userloc'}];

class SelectLocation extends React.Component {
    state = {
        showModal: {
            pin: false,
            saved: false,
            userloc: false
        },
        sel: null
    }
    getUserLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
            this.props.dispatch(updateUserLoc(position.coords));
            this.props.onSelect({lat:position.coords.latitude,long:position.coords.longitude},'userloc')
          }, err => console.error(err))
    }
    selectLocType = (visible, type) => {
        if(type == 'userloc') {
            this.getUserLocation();
        } else {
            this.setModalVisible(visible, type);
        }
    }
    setModalVisible = (visible, type) => {
        this.setState({
            showModal: {
                ...this.state.showModal,
                [type]: visible
            }
        })
    }

    render() {        
        const iconNames = ['ios-pin','ios-save','ios-man'];
        return (
            <ScrollView contentContainerStyle={styles.wrapper} style={{maxHeight:deviceHeight*.40}}>
                {selectTypes.map((type,i) => {
                    let checkedIcon;
                    if(this.props.tempEvent.court && type.key === this.props.tempEvent.court.selType) {
                        checkedIcon = {name:'md-checkmark',type:'ionicon',size:20,color:'green'}
                    }
                    return (
                        <ListItem
                            containerStyle={{width: 300}}
                            onPress={() => this.selectLocType(true, type.key)}
                            key={type.key}
                            title={type.val}
                            titleStyle={{textAlign:'left'}}
                            rightIcon={checkedIcon}
                            bottomDivider
                            leftIcon={{name:iconNames[i],type:'ionicon', color: '#333',style:{width:30}}}
                        />
                    )
                })}
                {// PIN TO MAP
                }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModal.pin}>
                    <View style={[styles.container]}>
                        <PinToMap 
                            onPinSelect={ coords => {
                                this.props.onSelect(coords, 'pin')
                                this.setModalVisible(false, 'pin')
                            }}
                            onCancel={ () => this.setModalVisible(false, 'pin')}
                        />
                        <Cancel onCancel={() => this.setModalVisible(false, 'pin')} />
                    </View>
                </Modal>
                {// SAVED COURTS
                }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModal.saved}>
                    <View style={[styles.centeredContainer, styles.center]}>
                         <Cancel onCancel={() => this.setModalVisible(false, 'saved')} />
                    </View>
                </Modal>  
                {// USER LOCATION
                }
                         
            </ScrollView>
        )
    }
}

const mapStateToProps = (state, props) => ({

})
export default connect(mapStateToProps)(SelectLocation);