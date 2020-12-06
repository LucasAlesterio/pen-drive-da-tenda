import React, { useState, useEffect } from 'react';
import { View, Image, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
//import api from '../../services/api';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import FieldSearch from '../../components/fieldSearch';
import api from '../../service/api';
import AsyncStorage from '@react-native-community/async-storage';

export default function Friends(){
    const [fieldSearch,setFieldSearch] = useState('');
    const [page,setPage] = useState(0);
    const [count,setCount] = useState(0);
    const [friends,setFriends] = useState([]);
    const [loading,setLoading] = useState(false);
    const {navigate} = useNavigation();
    const pageSize = 12;
    async function searchFriend(){
        const token = AsyncStorage.getItem('token');
        if(token){
            await api.post('/findUser',
            {search:fieldSearch,pageSize:pageSize,page:page},
            {headers:{Authorization:localStorage.getItem('token')}}).then((response)=>{
                if(response.data.error){
                    if(response.data.token){
                        Alert.alert('Necessário logar novamente!')
                        navigate('Landing');
                    }
                }
                setCount(response.data.count);
                setFriends(response.data.friends);
    
            }).catch((error)=>{
                Alert.alert('Erro no servidor!Tente novamente.')
            })
        }else{
            navigate('Landing');
        }
    }
    function onSearch(){
        setFieldSearch('');
        searchFriend();
    }
    return(
        <SafeAreaView style={styles.container} edges={['right','left','top']}>
            <Text style={styles.text} >Friends</Text>
            <FieldSearch 
            placeholder="Busca usuário" 
            value={fieldSearch} 
            setText={(t)=>setFieldSearch(t)} 
            onSubmit={(e)=>onSearch()}
            />
        </SafeAreaView>
    );
}