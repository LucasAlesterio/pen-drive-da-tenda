import React, { useState, useEffect } from 'react';
import { View, Image, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
//import api from '../../services/api';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../service/api';

export default function TimeLine(){
    const { navigate } = useNavigation();
    const [page,setPage] = useState(0);
    const [links,setLinks] = useState([]);
    const [count,setCount] = useState(0);
    const pageSize = 12;

    async function getData(){
        const token = AsyncStorage.getItem('token');
        if(token){
            await api.post('/timeLine',{pageSize:pageSize,page:page},{headers:{Authorization:token}})
            .then((response)=>{
                if(response.data.error){
                    if(response.data.token){
                        Alert.alert('Necessário logar novamente!')
                        navigate('Landing');
                    }
                }
                setCount(response.data.count);
                setLinks(response.data.link);
            }).catch((error)=>{
                console.log(error);
                navigate('Landing');
            });
        }else{
            navigate('Landing');
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.text} >Time Line</Text>
        </SafeAreaView>
    );
}