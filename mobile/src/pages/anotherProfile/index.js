import React, {useState, useCallback, useRef} from 'react';
import styles from './styles';
import api from '../../service/api';
import colors from '../../global.json';
import Link from '../../components/link';
import { Feather } from '@expo/vector-icons';
import Loading from '../../components/loading';
import MiniLoading from '../../components/miniLoading';
import FieldSearch from '../../components/fieldSearch'; 
import { RectButton } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useFocusEffect, useScrollToTop} from '@react-navigation/native';
import { View, Image, Text, Alert, ScrollView, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GoBack from '../../components/goBack';

export default function AnotherProfile({route}){
    const { idUser } = route.params;
    const vw = Dimensions.get('window').width;
    const vh = Dimensions.get('window').height;
    const [user,setUser] = useState({});
    const { navigate, goBack } = useNavigation();
    const [page,setPage] = useState(0);
    const pageSize = 12;
    const insets = useSafeAreaInsets();
    const [myLinks,setMyLinks] = useState([]);
    const [loading,setLoading] = useState(false);
    const [count,setCount] = useState(0);
    const ref = useRef(null);
    useScrollToTop(ref);

    useFocusEffect( useCallback(()=>{
        loadDataUser();
        searchMyLinks();
    },[]));
    useFocusEffect( useCallback(()=>{
        searchMyLinks(idUser);
    },[page,pageSize]));
    
    async function loadDataUser(){
        const token = await AsyncStorage.getItem('token');
        if(token){
            await api.post('/dataUser',{idUser:idUser},{headers:{Authorization:token}})
            .then((response)=>{
                if(response.data.error){
                    if(response.data.token){
                        navigate('Landing');
                        return null;
                    }
                    if(response.data.empty){
                        Alert.alert('Não encontramos esse usuário :( ');
                        goBack();
                        return null;
                    }
                }
                setUser(response.data);
                console.log(response.data);
                //searchMyLinks(response.data.user)
            }).catch((error)=>{
                console.log(error);
                Alert.alert("Erro no servidor!")
            });
        }else{
            navigate('Landing');
        }
    }
    /*
    useEffect(()=>{
        loadDataUser();
    },[]);
    */

    function testEndScroll({layoutMeasurement, contentOffset, contentSize}){
        if((layoutMeasurement.height + contentOffset.y  + 10>=
        contentSize.height) && (!loading) && (count > myLinks.length)){
            setLoading(true);
            setPage(page + 1);
        }
    }

async function searchMyLinks(user,flag){
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if(token){
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
    }
}
async function updateFriend(){
    const token = await AsyncStorage.getItem('token');
    try{
        await api.post('/updateFriend',{
            friend:user.id
        },{headers:{Authorization:token}});
        loadDataUser();
    }catch{
        alert('Erro no seridor!');
    }
}
    return(<>
        {!user.user ? <Loading/> : null }
        <SafeAreaView style={styles.container} edges={['right', 'top', 'left']}>
        <View style={{width:'100%'}}>
            <GoBack/>
        </View>
            <ScrollView
            contentContainerStyle={{alignItems:'center',backgroundColor:colors.cinzaMedio, paddingTop:0.05*vh}}
            style={{backgroundColor:colors.cinzaMedio}}
            onScroll={(e)=>testEndScroll(e.nativeEvent)}
            scrollEventThrottle={16}
            ref={ref}
            >
                <Image source={{uri:user.photograph}} style={styles.imageProfile}/>
                <View style={styles.containerUser}>
                    <Text style={[styles.text,styles.textUser]}>@{user.user}</Text>
                    {user.isFriend ? 
                    <RectButton onPress={()=>updateFriend()}>
                        <Feather name='user-check' size={25} color={colors.cinzaClaro}/>
                    </RectButton>:
                    <RectButton onPress={()=>updateFriend()}>
                        <Feather name='user-plus' size={25} color={colors.cinzaClaro}/>
                    </RectButton>
                    }
                </View>
                <Text style={[styles.text,{fontSize:25}]}>{user.name}</Text>
                <View style={{width:vw,paddingTop:20,backgroundColor:colors.cinzaMedio}}>
                    <View style={{width:'auto',alignItems:'center'}}>
                        <Text style={styles.textTitle}>Links</Text>
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
                </View>
            </ScrollView>
        </SafeAreaView>
        </>
    );
}