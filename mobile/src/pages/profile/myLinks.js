import React, {useState, useEffect, useRef} from 'react';
import styles from './styles';
import api from '../../service/api';
import colors from '../../global.json';
import Link from '../../components/link';
import { Feather } from '@expo/vector-icons';
import Loading from '../../components/loading';
import FieldSearch from '../../components/fieldSearch'; 
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Image, Text, Alert, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

export default function MyLinks(){
    const user = 'lucas.alesterio'
    const [field, setField] = useState('');
    const vh = Dimensions.get('window').height;
    const vw = Dimensions.get('window').width;
    const [page,setPage] = useState(0);
    const pageSize = 12;
    const insets = useSafeAreaInsets();
    const [myLinks,setMyLinks] = useState([]);
    const [loading,setLoading] = useState(false);
    const [count,setCount] = useState(0);
    let refLink = useRef(null);

    console.log(user);

    function testEndScroll({layoutMeasurement, contentOffset, contentSize}){
        if((layoutMeasurement.height + contentOffset.y  + 10>=
        contentSize.height) && (!loading) && (count > myLinks.length)){
            setLoading(true);
            setPage(page + 1);
        }   
    }
    function toEnd(){
        refLink.scrollToEnd({duration: 500});
    }

    function onSearchLink(){
        setLoading(true);
        setMyLinks([]);
        setPage(0);
        if(page === 0){
            searchMyLinks(user,true);
        //searchMyLinks(user.user,true);
        }
        
    }

    async function searchMyLinks(user,flag){
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        console.log('Page: ',page);
        if(token){
            if(!field){
                await api.post('/listMyLinks',
                {idUser:user,pageSize:pageSize,page:flag ? 0 : page},
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
                        if(myLinks){
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
                setField('');
            }
        }
    }
    useEffect(()=>{
        searchMyLinks(user);
    },[page,pageSize])

    return(<>
        {loading ? <Loading/> :null}
        <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{backgroundColor:colors.cinzaMedio,height:'auto'}}
        ref={(ref)=>refLink = ref}
        //keyboardShouldPersistTaps='always'
        onScroll={(e)=>testEndScroll(e.nativeEvent)}
        style={{maxHeight:(vh - insets.bottom - insets.top - 20)}}>
            <View style={{paddingVertical:10}}>
                <FieldSearch
                placeholder="Busca"
                value={field}
                setText={(t)=>setField(t)}
                onSubmit={()=>onSearchLink(field)}
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
                    />
                ))
                :
                null
                }
            </View>
        </ScrollView>
        </>
    );
}