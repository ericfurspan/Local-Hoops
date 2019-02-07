import React from 'react';
import { View, Modal, AlertIOS } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { Cancel } from '../navButtons';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import EventCard from './EventCard';
import { MAPBOX_ACCESS_TOKEN } from '../../../config';
import styles from '../styles/main';
import { deleteEvent } from '../../actions/Event';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

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
    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={true}>
                <View style={styles.modalBackground}>
                    <View style={[styles.fullCenterContainer,styles.modalContent,{backgroundColor:'#FAFAFA'}]}>
                        <EventCard 
                            event={this.props.event}
                        />
                        {this.props.currentUser.uid === this.props.event.event_author && 
                        <View style={styles.centeredRow}>
                            <Button
                                onPress={() => this.confirmDeleteEvent()}
                                icon={{name:'md-remove',type:'ionicon',size:16,color:'red'}}
                                title='Delete Event'
                                titleStyle={{color:'red',fontSize:14,fontWeight:'500'}}
                                buttonStyle={{backgroundColor:'transparent'}}
                            />                        
                        </View>}
                    </View>
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