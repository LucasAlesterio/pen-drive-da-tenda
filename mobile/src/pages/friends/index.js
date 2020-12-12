import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Alert, FlatList } from 'react-native';
import { useNavigation ,useScrollToTop, useFocusEffect} from '@react-navigation/native';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import FieldSearch from '../../components/fieldSearch';
import api from '../../service/api';
import AsyncStorage from '@react-native-community/async-storage';
import MiniLoading from '../../components/miniLoading';
import User from '../../components/user';

export default function Friends(){
    const [fieldSearch,setFieldSearch] = useState('');
    const [page,setPage] = useState(0);
    const [count,setCount] = useState(0);
    const [friends,setFriends] = useState([]);
    const {navigate} = useNavigation();
    const ref = useRef(null);
    const [refreshing,setRefreshing] = useState(false);
    const pageSize = 12;
    const [loading,setLoading] = useState(false);
    const [idUser,setIdUser] = useState('');
    useScrollToTop(ref);

    useFocusEffect( useCallback(()=>{
        searchFriend(true);
    },[]));

    async function searchFriend(flag){
        console.log('search')
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const id = await AsyncStorage.getItem('user');
        setIdUser(id);
        if(token){
            await api.post('/findUser',
            {search:fieldSearch,pageSize:pageSize,page:(flag ? 0 : page)},
            {headers:{Authorization:token}}).then((response)=>{
                if(response.data.error){
                    if(response.data.token){
                        Alert.alert('Necessário logar novamente!')
                        navigate('Landing');
                    }
                }
                if(friends.length > 0 && !flag){
                    setFriends(friends.concat(response.data.friends));
                }else{
                    setFriends(response.data.friends);
                }
                setCount(response.data.count);
                setLoading(false);
            }).catch((error)=>{
                console.log(error);
                setLoading(false);

                Alert.alert('Erro no servidor!Tente novamente.')
            })
        }else{
            setLoading(false);

            navigate('Landing');
        }
    }
    function onSearch(){
        setFieldSearch('');
        searchFriend(true);
    }
    function nextPage(){
        console.log('nextPage')
        console.log(count)
        if(friends.length < count && !loading){
            setPage(page + 1);
        }
    }
    function onRefresh(){
        console.log('onRefresh')
        setRefreshing(true);
        setPage(0);
        setFriends([]);
        searchFriend(true);
        setRefreshing(false);
    }

    useEffect(()=>{
        searchFriend();
    },[page]);

    return(
        <SafeAreaView style={styles.container} edges={['right','left','top']}>
            <FieldSearch 
            placeholder="Busca usuário" 
            value={fieldSearch} 
            setText={(t)=>setFieldSearch(t)} 
            onSubmit={(e)=>onSearch()}
            />
            <FlatList 
            ref={ref}
            refreshing={refreshing}
            onRefresh={()=>onRefresh()}
            data={friends}
            contentContainerStyle={{paddingTop:10}}
            renderItem={({item})=>(
                <User
                user={item.user}
                photo={item.mini}
                isFriend={item.isFriend}
                id={item._id}
                idUser={idUser}
                onChange={()=>searchFriend(true)}
                />
            )}
            keyExtractor={item=>item._id}
            onEndReached={()=>nextPage()}
            ListFooterComponent={
                loading ? 
                <View style={{alignSelf:'center'}}><MiniLoading/></View>
                :null
            }
            />
        </SafeAreaView>
    );
}