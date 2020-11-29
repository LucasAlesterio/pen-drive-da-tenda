import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../service/api';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles';
import Link from '../../components/link';
import Loading from '../../components/loading';
import FieldSearch from '../../components/fieldSearch'; 
//import colors from '../../global.json';
import Select from '../../components/Select';

export default function Search(){
    const [fieldSearch,setFieldSearch] = useState('');
    const [loading,setLoading] = useState(false);
    const [order,setOrder] = useState(3);
    const [type,setType] = useState('');
    const [page,setPage] = useState(0);
    const [links,setLinks] = useState([]);
    const [typeList,setTypeList] = useState([]);
    const [pageSize,setPageSize] = useState(12);
    const nLinks = 12;
    //navigate('Tabs',{screen:'Search'});
    const { navigate } = useNavigation();

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
    
    async function searchLinks(){
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        try{
            const response = await api.post('/searchLink',
            {
                text:fieldSearch,
                pageSize:pageSize,
                page:page,
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
                if(links){
                    setLinks(links.concat(response.data.links));
                }else{
                    setLinks(response.data.links);
                }
                //setCount(response.data.count);
            }
            setLoading(false);
        }catch{
            setLoading(false);
            Alert.alert('Erro no servidor!');
        }
    };
    useEffect(()=>{
        searchLinks();
    },[page,type,order])
    useEffect(()=>{
        loadTypes();
    },[]);

    function testEndScroll({layoutMeasurement, contentOffset, contentSize}){
        if(layoutMeasurement.height + contentOffset.y >=
        contentSize.height){
            setPage(page + 1);
            
        }
    }
    //console.log('type');
    function setNewOrder(e){
        //setPage(0);
        //setLinks([]);
        //setPageSize(nLinks * (page + 1))
        setOrder(e);
    }
    function setNewType(e){
        //setPage(0);
        //setLinks([]);
        //setPageSize(nLinks * (page + 1));
        setType(e);
    }
    return(<>
        {loading ? <Loading/> : null}
        <View style={styles.container}
            >
            <FieldSearch 
            placeholder="Busca" 
            value={fieldSearch} 
            setText={(t)=>setFieldSearch(t)} 
            onSubmit={(e)=>searchLinks()}
            />
            <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',paddingHorizontal:'6%'}}>
                <Select
                setValue={(v)=>setNewType(v)}
                value={type}
                placeholder="Tipo"
                items={(typeList) || []}/>

                <Select
                setValue={(v)=>setNewOrder(v)}
                value={order}
                label
                placeholder="Ordenar"
                items={ [['Aa-Zz',1],['Zz-Aa',2],['Mais recentes',3],['Menos recente',4],['Maior avaliação',5],['Menor avaliação',6]]}/>
                
            </View>
            <ScrollView 
            onScrollEndDrag = {(e)=>testEndScroll(e.nativeEvent)}
            contentContainerStyle={{paddingBottom: 20}}
            //onScroll={(e)=>testEndScroll(e.nativeEvent)}
            >
                <View style={styles.containerLinks}>
                    {links ? links.map((link)=>(
                        <Link 
                        key={link._id}
                        image={link.photograph}
                        //image="https://dogmemes.com/wp-content/uploads/2020/03/tumblr_onyvh1wbss1vi3bo0o1_500-255x270.jpg"
                        average={link.average} 
                        title={link.name}
                        />
                    )):null}
                </View>
            </ScrollView>
        </View>
        </>
    );
}