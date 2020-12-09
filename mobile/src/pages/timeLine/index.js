import React, { useState, useEffect } from 'react';
import {Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../service/api';
import LinkTimeLine from '../../components/linkTimeLine';

export default function TimeLine(){
    const { navigate } = useNavigation();
    const [page,setPage] = useState(0);
    const [links,setLinks] = useState([]);
    const [count,setCount] = useState(0);
    const pageSize = 12;

    async function getData(){
        const token = await AsyncStorage.getItem('token');
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
    useEffect(()=>{
        getData();
    },[])

    return(
        <SafeAreaView style={styles.container}>
        {links[0] ? 
            <LinkTimeLine 
            title={links[0].name} 
            average={links[0].average} 
            imageLink={links[0].mini} 
            imageUser={links[0].user.photograph} 
            user={links[0].user.user} 
            id={links[0]._id}
            />
            :null}
        </SafeAreaView>
    );
}