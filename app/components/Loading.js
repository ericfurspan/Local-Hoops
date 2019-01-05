import React from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import styles from './styles/main';

class Loading extends React.Component {

    render() {
        let activityIndicator;
        if(this.props.indicator == true) {
            let activityIndicator = <ActivityIndicator size='large' color='#FFFFFF'/>
        }

        return (
            <View style={[styles.fullCenterContainer,{backgroundColor: '#3578E5'}]}>
                <Text style={[styles.text,{fontFamily: 'ArchitectsDaughter-Regular',color:'#FFFFFF'}]}>{this.props.message}</Text>   
                {this.props.indicator ? <ActivityIndicator size='large' color='#FFFFFF'/> : null}
                {/*<Image source={require('../../assets/img/nyk.png')} style={{width:50,height:50}}/>*/}
            </View>
        )
    }
}

export default Loading;