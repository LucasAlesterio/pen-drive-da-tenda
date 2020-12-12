import React, {useState, useCallback, useRef} from 'react';
import styles from './styles';
import api from '../../service/api';
import colors from '../../global.json';
import Link from '../../components/link';
import MiniLoading from '../../components/miniLoading';
import FieldSearch from '../../components/fieldSearch'; 
import { useFocusEffect, useScrollToTop} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Alert, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyLinks(){
    const [field, setField] = useState('');
    const vh = Dimensions.get('window').height;
    const vw = Dimensions.get('window').width;
    const [page,setPage] = useState(0);
    const pageSize = 12;
    const insets = useSafeAreaInsets();
    const [myLinks,setMyLinks] = useState([]);
    const [loading,setLoading] = useState(false);
    const [count,setCount] = useState(0);
    const ref = useRef(null);
    const [user,setUser] = useState('');
    useScrollToTop(ref);

    function testEndScroll({layoutMeasurement, contentOffset, contentSize}){
        if((layoutMeasurement.height + contentOffset.y  + 10>=
        contentSize.height) && (!loading) && (count > myLinks.length)){
            setLoading(true);
            setPage(page + 1);
        }
    }

    function onSearchLink(){
        setLoading(true);
        setMyLinks([]);
        setPage(0);
        if(page === 0){
            searchMyLinks(true);
        }
    }

    async function searchMyLinks(flag){
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        setUser(user);
        if(token){
            if(!field){
                await api.post('/listMyLinks',
                {idUser:user,pageSize:pageSize,page:flag ? 0 : page},
                {headers:{Authorization:token}})
                .then((response)=>{
                    const links = response.data.links;
                    if(links){
                        if(myLinks && !flag){
                            //toEnd();
                            setMyLinks(myLinks.concat(response.data.links));
                        }else{
                            setMyLinks(response.data.links);
                        }
                    }
                    //setMyLinks(response.data.links);
                    setCount(response.data.count);
                    setLoading(false);
                    return null;
                }).catch((error)=>{
                    console.log(error);
                    setLoading(false);
                    Alert.alert('Erro no servidor!');
                })
            }else{
                await api.post('/searchInMyLinks',
                {user:user,pageSize:pageSize,page:page,text:field,myLinks:true},
                {headers:{Authorization:token}})
                .then((response)=>{
                    const links = response.data.links;
                    if(links){
                        if(myLinks && !flag){
                            setMyLinks(myLinks.concat(response.data.links));
                        }else{
                            setMyLinks(response.data.links);
                        }
                    }
                    setCount(response.data.count);
                    setLoading(false);
                }).catch((error)=>{
                    console.log(error);
                    setLoading(false);
                    Alert.alert('Erro no servidor!');
                });
            }
            setField('');
        }
    }
    /*
    useEffect(()=>{
        searchMyLinks(user);
    },[page,pageSize])
    */

    useFocusEffect( useCallback(()=>{
        searchMyLinks();
    },[page,pageSize]));

    return(
        <ScrollView
        bounces={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{backgroundColor:colors.cinzaMedio}}
        onScroll={(e)=>testEndScroll(e.nativeEvent)}
        scrollEventThrottle={16}
        ref={ref}
        style={{maxHeight:(vh - insets.bottom - insets.top - 20),backgroundColor:colors.cinzaMedio}}>
            <View style={{paddingVertical:10}}>
                <FieldSearch
                placeholder="Busca"
                value={field}
                setText={(t)=>setField(t)}
                onSubmit={()=>onSearchLink()}
                />
                
            </View>
            <View style={styles.containerLinks}>
                {
                myLinks.length > 0 ?  
                myLinks.map((link)=>(
                    <Link 
                    key={link._id}
                    image={link.mini}
                    id={link._id}
                    vw = {vw}
                    average={link.average} 
                    title={link.name}
                    idUser={user}
                    />
                ))
                :
                null
                }
                <View style={{width:'100%',alignItems:'center',paddingBottom:(vh*0.05)}}>
                    {loading ? <MiniLoading/> : null}
                </View>
                
            </View>
        </ScrollView>
    );
}