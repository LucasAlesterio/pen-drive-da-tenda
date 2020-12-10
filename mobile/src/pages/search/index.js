import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Dimensions, FlatList} from 'react-native';
import { useNavigation, useScrollToTop  } from '@react-navigation/native';
import api from '../../service/api';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles';
import Link from '../../components/link';
import Loading from '../../components/loading';
import FieldSearch from '../../components/fieldSearch'; 
import Select from '../../components/Select';
import { SafeAreaView } from 'react-native-safe-area-context';
import MiniLoading from '../../components/miniLoading';

export default function Search({idUser}){
    const [fieldSearch,setFieldSearch] = useState('');
    const [loading,setLoading] = useState(false);
    const [order,setOrder] = useState(3);
    const [type,setType] = useState('');
    const [page,setPage] = useState(0);
    const [links,setLinks] = useState([]);
    const [typeList,setTypeList] = useState([]);
    const [pageSize,setPageSize] = useState(12);
    const nLinks = 12;
    const [count,setCount] = useState(0);
    const vw = Dimensions.get('window').width;
    const vh = Dimensions.get('window').height;
    const [refreshing,setRefreshing] = useState(false);
    //navigate('Tabs',{screen:'Search'});
    const ref = useRef(null);
    const { navigate } = useNavigation();
    useScrollToTop(ref);
    
    async function loadTypes(){
        try{
            const token = await AsyncStorage.getItem('token');
            const response = await api.get('/types',{headers:{Authorization:token}});
            if(response.data){
                setTypeList(response.data.types);
                if(response.data.error){
                    if(response.data.token){
                        Alert.alert('Necessário logar novamente!')
                        navigate('Landing');
                        return null;
                    }
                }
            }
        }catch{
            alert('Erro no servidor');
        }
    }
    
    async function searchLinks(initial){
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        try{
            const response = await api.post('/searchLink',
            {
                text:fieldSearch,
                pageSize:pageSize,
                page: initial ? 0 : page,
                type:type,
                order:order
            },
            {headers:{Authorization:token}});
            if(response.data.erro){
                if(response.data.token){
                    navigate('Landing');
                }
            }else{
                //console.log(response.data.links)
                if(links && !initial){
                    setLinks(links.concat(response.data.links));
                }else{
                    setLinks(response.data.links);
                }
                if(count != response.data.count ){
                    setCount(response.data.count);
                }
            }
            setLoading(false);
            return null;
        }catch{
            setLoading(false);
            Alert.alert('Erro no servidor!');
            return null;
        }
    };
    useEffect(()=>{
        searchLinks();
    },[page,type,order,pageSize])

    useEffect(()=>{
        loadTypes();
    },[]);

    function setNewOrder(e){
        if(e !== order){
            setPage(0);
            setLinks([]);
            //setPageSize(nLinks * (page + 1))
            setOrder(e);
        }
    }
    function setNewType(e){
        if(e !== type){
            setPage(0);
            setLinks([]);
            //setPageSize(nLinks * (page + 1));
            setType(e);
        }
    }

    function onSearch(){
        setPage(0);
        setLinks([]);
        searchLinks(true);
    }

    function nextPage(){
        if(links.length < count && !loading){
            setLoading(true);
            setPage(page + 1);
        }
    }
    function onRefresh(){
        setRefreshing(true);
        setPage(0);
        setLinks([]);
        searchLinks(true);
        setRefreshing(false)
    }
    return(<>
        {!typeList ? <Loading/> : null}
        <SafeAreaView style={styles.container} edges={['right', 'top', 'left']}>
            <FieldSearch 
            placeholder="Busca" 
            value={fieldSearch} 
            setText={(t)=>setFieldSearch(t)} 
            onSubmit={(e)=>onSearch()}
            />
            <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',paddingHorizontal:'6%',paddingBottom:10}}>
                <Select
                setValue={(v)=>setNewType(v)}
                value={type}
                placeholder="Tipo"
                valueDefault={null}
                items={(typeList) || []}/>

                <Select
                setValue={(v)=>setNewOrder(v)}
                value={order}
                label
                valueDefault={3}
                placeholder="Ordenar"
                items={ [['Aa-Zz',1],['Zz-Aa',2],['Mais recentes',3],['Menos recente',4],['Maior avaliação',5],['Menor avaliação',6]]}/>
                
            </View>
            <FlatList 
            ref={ref}
            columnWrapperStyle={{justifyContent: 'space-around'}}
            numColumns={2}
            refreshing={refreshing}
            onRefresh={()=>onRefresh()}
            data={links}
            renderItem={({item})=>(
                <Link
                image={item.mini}
                id={item._id}
                vw = {vw}
                average={item.average} 
                title={item.name}
                idUser={idUser}
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
        </>
    );
}