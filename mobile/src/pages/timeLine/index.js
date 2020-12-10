import React, { useState, useEffect, useRef } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../service/api';
import LinkTimeLine from '../../components/linkTimeLine';
import MiniLoading from '../../components/miniLoading';

export default function TimeLine(){
    const { navigate } = useNavigation();
    const [page,setPage] = useState(0);
    const [links,setLinks] = useState([]);
    const [count,setCount] = useState(0);
    const [loading,setLoading] = useState(false);
    const pageSize = 12;
    const ref = useRef(null);
    const [refreshing,setRefreshing] = useState(false);
    useScrollToTop(ref);

    async function getData(flag){
        const token = await AsyncStorage.getItem('token');
        if(token){
            await api.post('/timeLine',{pageSize:pageSize,page:flag ? 0 : page},{headers:{Authorization:token}})
            .then((response)=>{
                if(response.data.error){
                    if(response.data.token){
                        Alert.alert('Necessário logar novamente!')
                        navigate('Landing');
                    }
                }
                if(links.length>0 && !flag){
                    setLinks(links.concat(response.data.link));
                }else{
                    setLinks(response.data.link);
                }
                setCount(response.data.count);
                setLoading(false);
            }).catch((error)=>{
                console.log(error);
                setLoading(false);
                navigate('Landing');
            });
        }else{
            setLoading(false);
            navigate('Landing');
        }
    }
    useEffect(()=>{
        getData();
    },[page])
    
    function nextPage(){
        if(links.length < count && !loading){
            setLoading(true);
            setPage(page + 1);
        }
    }
    function onRefresh(){
        setRefreshing(true);
        setPage(0);
        getData(true);
        setRefreshing(false)
    }

    return(
        <SafeAreaView style={styles.container}>
            {count ?
            <FlatList 
            ref={ref}
            refreshing={refreshing}
            onRefresh={()=>onRefresh()}
            data={links}
            renderItem={({item})=>(
                <LinkTimeLine 
                name={item.name} 
                average={item.average} 
                mini={item.mini}
                user={item.user} 
                _id={item._id}
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
            :null}
        </SafeAreaView>
    );
}