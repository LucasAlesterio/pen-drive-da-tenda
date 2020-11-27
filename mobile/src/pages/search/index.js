import React, { useState, useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
//import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles';
//import Loading from '../../components/loading';

export default function Search(){
    const [token,setToken] = useState('');
    async function getToken(){
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        //return token;
    }
    if(!token){
        getToken();
    }
    return(<>
        <View style={styles.container}>
            <Text style={styles.text} >Search</Text>
            <Text style={styles.text}>{token}</Text>
        </View>
        </>
    );
}