import React from 'react';
import {View ,Animated, Easing} from 'react-native';
import { StyleSheet } from 'react-native';

export default function Loading(){
    const imageUsb = require('../../../assets/usb.png');
    var spinValue = new Animated.Value(0);
    Animated.loop(
        Animated.timing(
            spinValue,
            {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        )
    ).start();

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const styles = StyleSheet.create({
        container:{
            backgroundColor:'#00000099',
            alignItems:'center',
            justifyContent:'center',
            position:'absolute',
            zIndex:30,
            width:'100%',
            height:'100%'
        }
    });
    return(
        <View style={styles.container}>
            <Animated.Image
            style={{transform: [{rotate: spin}],height:100,width:100}}
            source={imageUsb} />
        </View>
    );
}