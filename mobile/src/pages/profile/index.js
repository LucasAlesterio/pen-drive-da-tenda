import React, { useState, useEffect } from 'react';
import styles from './styles';
import api from '../../service/api';
import { View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';

export default function Profile({route}){

    const { idUser } = route.params;
    const { navigate, goBack } = useNavigation();

    async function loadDataUser(){
        const token = await AsyncStorage.getItem('token');
        api.post('/dataUser',{idUser:user},{headers:token})
        .then((response)=>{
            if(response.data.error){
                if(response.data.token){
                    navigate('Landing');
                    return null;
                }
                if(response.data.empty){
                    alert('Não encontramos esse usuário :( ');
                    goBack();
                    return null;
                }
            }
        }).catch();
    }
    useEffect(()=>{

    },[])
    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.text} >Profile</Text>
        </SafeAreaView>
    );
}