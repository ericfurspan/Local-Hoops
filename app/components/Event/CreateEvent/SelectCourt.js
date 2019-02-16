import React from 'react';
import { View, ScrollView, Dimensions, Modal, Text, StatusBar } from 'react-native';
import { ListItem, Header, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Cancel } from '../../navButtons';
import styles from '../../styles/main';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { MAPBOX_ACCESS_TOKEN } from '../../../../config';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

let deviceWidth = Dimensions.get('window').width;

const selectTypes = [ {val: 'Select from Favorite courts', key: 'favorites'}, {val: 'Select from Nearby courts', key: 'nearby'} ];

class SelectCourt extends React.Component {
    state = {
      showModal: {
        nearby: false,
        favorites: false,
      },
      sel: null
    }
    navigateAddCourt = () => {
      this.props.closeEventModal();
      this.props.navigation.navigate('Explore', { action: {type: 'showAddCourtForm'} });
    }

    selectLocType = (visible, type) => {
      this.setModalVisible(visible, type);
    }
    setModalVisible = (visible, type) => {
      this.setState({
        showModal: {
          ...this.state.showModal,
          [type]: visible
        }
      })
    }
    returnAnnotation = (coords) => {
      return (
        <Mapbox.PointAnnotation
          key={"2"}
          id={"2"}
          coordinate={[coords.longitude, coords.latitude]}
          title="annotation title"
        >
          <IonIcon
            name='ios-pin'
            size={30}
            color='red'
          />
        </Mapbox.PointAnnotation>
      )
    }

    render() {
      const iconNames = ['ios-bookmark','ios-pin'];
      return (
        <ScrollView contentContainerStyle={styles.wrapper}>
          {this.state.showModal.nearby || this.state.showModal.favorites ?
            <StatusBar hidden />
            : null
          }

          {selectTypes.map((type,i) => {
            let checkedIcon;
            if(this.props.tempEvent.court && type.key === this.props.tempEvent.court.selType) {
              checkedIcon = {name: 'ios-checkmark',type: 'ionicon',size: 35,color: 'green'}
            }
            return (
              <ListItem
                containerStyle={{width: 300}}
                onPress={() => this.selectLocType(true, type.key)}
                key={type.key}
                title={type.val}
                titleStyle={{textAlign: 'left'}}
                rightIcon={checkedIcon}
                bottomDivider
                leftIcon={{name: iconNames[i],type: 'ionicon', color: '#333',style: {width: 30}}}
              />
            )
          })}

          {// ADD NEW COURT
          }
          <View style={{alignItems: 'center',marginTop: 50}}>
            <Text style={{fontSize: 18}}>Don&apos;t see your court?</Text>
            <Button
              title='Add to map'
              onPress={() => {
                this.navigateAddCourt()
              }}
              titleStyle={{color: '#3578E5',fontSize: 18,fontWeight: '500'}}
              icon={{name: 'ios-add',type: 'ionicon',size: 25,color: '#3578E5'}}
              buttonStyle={{backgroundColor: 'transparent'}}
            />
          </View>

          {this.props.tempEvent.court ?
            <View>
              <Text style={{alignSelf: 'center',fontSize: 15,fontWeight: '500',marginTop: 50,marginBottom: 10}}>You have selected</Text>
              <Text style={{alignSelf: 'center',fontSize: 18,fontWeight: '500',fontStyle: 'italic'}}>{this.props.tempEvent.court.name}</Text>
            </View>
            : null
          }

          {// SAVED COURTS
          }
          <Modal
            transparent={false}
            visible={this.state.showModal.favorites}>
            <View style={styles.modalBackground}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Header
                  centerComponent={{ text: 'Saved Courts', style: { color: '#FFFFFF', fontSize: 24 } }}
                  containerStyle={styles.routeHeader}
                />
                <Text style={{alignSelf: 'center',fontSize: 18,fontWeight: '500',margin: 10}}>Select a Court</Text>
                {this.props.savedCourts && this.props.savedCourts.map(court => (
                  <ListItem
                    title={court.name}
                    key={court.id}
                    chevron
                    titleStyle={styles.listTitle}
                    bottomDivider
                    leftElement={
                      <View style={{height: 100,marginBottom: 5,width: deviceWidth*.4}}>
                        <Mapbox.MapView
                          scrollEnabled={false}
                          styleURL={Mapbox.StyleURL.Street}
                          zoomLevel={14}
                          centerCoordinate={[court.coords.longitude, court.coords.latitude]}
                          showUserLocation={false}
                          style={{flex: 1}}
                          logoEnabled={false}
                        >
                          {this.returnAnnotation(court.coords)}
                        </Mapbox.MapView>
                      </View>
                    }
                    onPress={() => {
                      this.props.onSelect(court, 'favorites')
                      this.setModalVisible(false, 'favorites')
                    }}
                  />
                ))}
              </ScrollView>
            </View>
            <Cancel onCancel={() => this.setModalVisible(false, 'favorites')} />
          </Modal>
          {// NEARBY COURTS
          }
          <Modal
            transparent={false}
            visible={this.state.showModal.nearby}>
            <View style={styles.modalBackground}>
              <ScrollView style={[styles.modalContent]}>
                <Header
                  centerComponent={{ text: 'Nearby Courts', style: { color: '#FFFFFF', fontSize: 24 } }}
                  containerStyle={styles.routeHeader}
                />
                <Text style={{alignSelf: 'center',fontSize: 18,fontWeight: '500',margin: 10}}>Select a Court</Text>
                {this.props.nearbyCourts && this.props.nearbyCourts.map(court => (
                  <ListItem
                    title={court.name}
                    key={court.id}
                    chevron
                    titleStyle={styles.listTitle}
                    bottomDivider
                    leftElement={
                      <View style={{height: 100,marginBottom: 5,width: deviceWidth*.4}}>
                        <Mapbox.MapView
                          scrollEnabled={false}
                          styleURL={Mapbox.StyleURL.Street}
                          zoomLevel={14}
                          centerCoordinate={[court.coords.longitude, court.coords.latitude]}
                          showUserLocation={false}
                          style={{flex: 1}}
                          logoEnabled={false}
                        >
                          {this.returnAnnotation(court.coords)}
                        </Mapbox.MapView>
                      </View>
                    }
                    onPress={() => {
                      this.props.onSelect(court, 'nearby')
                      this.setModalVisible(false, 'nearby')
                    }}
                  />
                ))}
              </ScrollView>
            </View>
            <Cancel onCancel={() => this.setModalVisible(false, 'nearby')} />
          </Modal>
        </ScrollView>
      )
    }
}

export default connect()(withNavigation(SelectCourt));