import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Alert, Dimensions} from 'react-native';
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
        //console.log('count:',count,' ,links:',links.length, 'page: ',page);
        searchLinks();
    },[page,type,order,pageSize])

    useEffect(()=>{
        loadTypes();
    },[]);

    function testEndScroll({layoutMeasurement, contentOffset, contentSize}){
        if((layoutMeasurement.height + contentOffset.y  + 20>=
        contentSize.height) && (!loading) && (count > links.length)){
            setLoading(true);
            setPage(page + 1);
        }
    }
    //console.log('type');
    function setNewOrder(e){
        if(e !== order){
            setPage(0);
            setLinks([]);
            setPageSize(nLinks * (page + 1))
            setOrder(e);
        }
    }
    function setNewType(e){
        if(e !== type){
            setPage(0);
            setLinks([]);
            setPageSize(nLinks * (page + 1));
            setType(e);
        }
    }

    function onSearch(){
        setPage(0);
        setLinks([]);
        searchLinks(true);
    }

    function listLinks(){
        if(links){ 
            return(links.map((link)=>(
                <Link 
                key={link._id}
                image={link.mini}
                id={link._id}
                vw = {vw}
                average={link.average} 
                title={link.name}
                idUser={idUser}
                />
            )))
        }
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
            <ScrollView 
            //onScrollEndDrag = {(e)=>testEndScroll(e.nativeEvent)}
            contentContainerStyle={{paddingBottom: 20}}
            onScroll={(e)=>testEndScroll(e.nativeEvent)}
            ref={ref}
            >
                <View style={styles.containerLinks}>
                    {listLinks()}
                    <View style={{width:'100%',alignItems:'center',paddingBottom:(vh*0.05)}}>
                    {loading ? <MiniLoading/> : null}
                </View>
                </View>
            </ScrollView>
        </SafeAreaView>
        </>
    );
}