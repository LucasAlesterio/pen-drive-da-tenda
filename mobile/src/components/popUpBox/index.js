import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import PopUp from '../popUp';
import {Feather} from '@expo/vector-icons';
import colors from '../../global.json';
export default function PopUpBox({open,onClose,title,children}){
    const vh = Dimensions.get('window').height;
    const vw = Dimensions.get('window').width;

    const styles = StyleSheet.create({
        container:{
            width:(0.9*vw),
            minHeight:(0.5*vw),
            borderWidth:1,
            borderColor:colors.amarelo,
        },
        header:{
            backgroundColor:colors.cinzaEscuro,
            width:'100%',
            height:40,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center'
        },
        title:{
            color:colors.amarelo,
            fontFamily:'Righteous_400Regular',
            fontSize:22
        },
        buttonClose:{
            position:'absolute',
            right:0,
            paddingRight:5,
        },
        body:{
            backgroundColor:colors.cinzaMedio,
            minHeight:(0.5*vw)-38,
            alignItems:'center',
            justifyContent:'center',
        }
    });
    return(
        <PopUp open={open} onClose={()=>onClose(false)}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity style={styles.buttonClose} onPress={()=>onClose(false)} title="">
                        <Feather name="x" size={30} color={colors.cinzaClaro}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    {children}
                </View>
            </View>
        </PopUp>
    );
}