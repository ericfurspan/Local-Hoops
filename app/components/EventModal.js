import React from 'react';
import { View, Text, Dimensions, Modal, AlertIOS } from 'react-native';
import { Avatar, Button, Card } from 'react-native-elements';
import styles from './styles/main';
import { connect } from 'react-redux';
import { deleteEvent } from '../actions/Event';
import { Cancel } from './navButtons';
import { MAPBOX_ACCESS_TOKEN } from '../../config';
import Mapbox from '@mapbox/react-native-mapbox-gl';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

let deviceHeight= Dimensions.get('window').height;

class EventModal extends React.Component {
    confirmDeleteEvent = () => {
        AlertIOS.alert(
            'Please Confirm',
            `Are you sure you want to delete this event?`,
            [
              {
                text: 'Cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                    this.props.dispatch(deleteEvent(this.props.event))
                    this.props.setModalVisible(false)
                }
              },
            ]
          );
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
    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={true}>
                <View style={[styles.fullCenterContainer,{backgroundColor:'#FAFAFA'}]}>
                    <Card
                        title={`${this.props.event.title} - ${this.props.event.time}`}
                        containerStyle={styles.cardContainer}
                    >

                        <Text style={styles.modalHeader}>Participants</Text>
                        <View style={[styles.centeredRow,{marginBottom:20}]}>
                            {this.props.event.participants.map((p,i) => {
                                return (
                                    <Avatar
                                        size='small'
                                        rounded
                                        source={{uri: p.photoURL}}
                                        activeOpacity={0.7}
                                        containerStyle={{margin:5}}
                                        key={i}
                                    />
                                )
                            })}                                  
                        </View>
    
                        <Text style={styles.modalHeader}>Comment</Text>
                        <View style={styles.evenSpacedRow}>
                            <Text>{this.props.event.comment}</Text>
                        </View>  

                        <Text style={styles.modalHeader}>Court</Text> 
                        <View style={[styles.evenSpacedRow,{height:deviceHeight*.20}]}>
                            <Mapbox.MapView
                                styleURL={Mapbox.StyleURL.Light}
                                zoomLevel={15}
                                centerCoordinate={[this.props.event.court.long, this.props.event.court.lat]}
                                showUserLocation={false}
                                style={{flex: 1}}
                                logoEnabled={false}
                            >
                                {this.returnAnnotation({lat: this.props.event.court.lat, long: this.props.event.court.long})}
                            </Mapbox.MapView> 
                        </View>
                        {this.props.currentUser.uid === this.props.event.event_author && 
                        <View style={styles.centeredRow}>
                            <Button
                                onPress={() => this.confirmDeleteEvent()}
                                icon={{name:'md-remove',type:'ionicon',size:16,color:'red'}}
                                title='Delete Event'
                                titleStyle={{color:'red',fontSize:14,fontWeight:'500',marginLeft:-5}}
                                buttonStyle={{backgroundColor:'transparent'}}
                            />                        
                        </View>}
                    </Card>
                    <Cancel onCancel={() => this.props.setModalVisible(false)} />
                </View>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.currentUser
})

export default connect(mapStateToProps)(EventModal);