import React from 'react';
import { View, ScrollView, Dimensions, Modal, Text, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Cancel } from '../../navButtons';
import PinToMap from './PinToMap';
import { updateLocation } from '../../../actions/Location';
import styles from '../../styles/main';

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
            this.props.dispatch(updateLocation(position.coords));
            this.props.onSelect({lat:position.coords.latitude,long:position.coords.longitude},'userloc')
          }, err => {
              console.log('error in getUserLocation - SelectionLocation.js')
              console.log(err)
            })
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
        const iconNames = ['ios-pin','ios-save','md-locate'];
        return (
            <ScrollView contentContainerStyle={styles.wrapper} style={{maxHeight:deviceHeight*.40}}>
                {selectTypes.map((type,i) => {
                    let checkedIcon;
                    if(this.props.tempEvent.court && type.key === this.props.tempEvent.court.selType) {
                        checkedIcon = {name:'ios-checkmark',type:'ionicon',size:20,color:'green'}
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
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContent]}>
                            <FlatList
                                data={this.props.nearbyCourts} // get data from /courts for ids in user/uid/saved_courts
                                keyExtractor={(item,i) => i.toString()}
                                renderItem={({item}) => (
                                <ListItem
                                    title={item.name}
                                    titleStyle={styles.listTitle}
                                    subtitle={item.location}
                                    subtitleStyle={styles.listSubtext}
                                    bottomDivider
                                    rightIcon={
                                        <View style={{alignItems:'center'}}>
                                            <IonIcon
                                                name='ios-navigate'
                                                size={30}
                                                color='#3578E5'
                                                onPress={() => this.openExternalMap(item.coords)} 
                                            />
                                            <Text style={{fontWeight:'bold',color:'#3578E5',fontSize:14}}>Navigate</Text>
                                        </View>                                    
                                    }
                                />
                                )}
                            />
                        </View>
                    </View>
                    <Cancel onCancel={() => this.setModalVisible(false, 'saved')} />
                </Modal>                
  
                {// USER LOCATION
                }
                         
            </ScrollView>
        )
    }
}

export default connect()(SelectLocation);