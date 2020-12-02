import React, {useState, useEffect, useRef} from 'react';
import styles from './styles';
import api from '../../service/api';
import { View, Image, Text, Alert, ScrollView, Dimensions, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { Feather } from '@expo/vector-icons';
import colors from '../../global.json';
import Loading from '../../components/loading';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Link from '../../components/link';
import FieldSearch from '../../components/fieldSearch'; 

export default function Profile({idUser}){
    const Tab = createMaterialTopTabNavigator();
    const vw = Dimensions.get('window').width;
    const vh = Dimensions.get('window').height;
    const [user,setUser] = useState({});
    //const [scrollFlag,setScrollFlag] = useState(false);
    const [loading,setLoading] = useState(false);
    const [fieldSearchMyLinks,setFieldSearchMyLinks] = useState('');
    const [myLinks,setMyLinks] = useState([]);
    const [fieldSearchMyFavorites,setFieldSearchMyFavorites] = useState('');
    const [count,setCount] = useState({link:0,favorite:0});
    const [page,setPage] = useState(0);
    const pageSize = 12;
    const { navigate, goBack } = useNavigation();
    const refLink = useRef(null);

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
                searchMyLinks(response.data.user)
            }).catch((error)=>{
                console.log(error);
                Alert.alert("Erro no servidor!")
            });
        }else{
            navigate('Landing');
        }
    }

    async function searchMyLinks(user,flag){
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        console.log('Page: ',page);
        if(token){
            if(!fieldSearchMyLinks){
                await api.post('/listMyLinks',
                {idUser:user,pageSize:pageSize,page:flag ? 0 : page},
                {headers:{Authorization:token}})
                .then((response)=>{
                    const links = response.data.links;
                    if(links){
                        if(myLinks && !flag){
                            //console.log(myLinks);
                            setMyLinks(myLinks.concat(links.map((link)=>(
                                <Link 
                                key={link._id}
                                image={link.mini}
                                id={link._id}
                                vw = {vw}
                                average={link.average} 
                                title={link.name}
                                />
                            ))))
                        }else{
                            //setPage(0);
                            setMyLinks(links.map((link)=>(
                                <Link 
                                key={link._id}
                                image={link.mini}
                                id={link._id}
                                vw = {vw}
                                average={link.average} 
                                title={link.name}
                                />
                            )))
                        }
                    }
                    //setMyLinks(response.data.links);
                    setCount({link:response.data.count,favorites:count.favorites});
                    setLoading(false);
                    return null;
                }).catch((error)=>{
                    console.log(error);
                    setLoading(false);
                    Alert.alert('Erro no servidor!');
                })
            }else{
                await api.post('/searchInMyLinks',
                {user:user,pageSize:pageSize,page:page,text:fieldSearchMyLinks,myLinks:true},
                {headers:{Authorization:token}})
                .then((response)=>{
                    const links = response.data.links;
                    if(links){
                        if(myLinks){
                            //console.log(myLinks);
                            setMyLinks(myLinks.concat(links.map((link)=>(
                                <Link 
                                key={link._id}
                                image={link.mini}
                                id={link._id}
                                vw = {vw}
                                average={link.average} 
                                title={link.name}
                                />
                            ))))
                        }else{
                            //setPage(0);
                            setMyLinks(links.map((link)=>(
                                <Link 
                                key={link._id}
                                image={link.mini}
                                id={link._id}
                                vw = {vw}
                                average={link.average} 
                                title={link.name}
                                />
                            )))
                        }
                    }
                    //setMyLinks(response.data.links);
                    setCount({link:count.link,favorites:response.data.count});
                    setLoading(false);
                }).catch((error)=>{
                    console.log(error);
                    setLoading(false);
                    Alert.alert('Erro no servidor!');
                });
                setFieldSearchMyLinks('');
            }
        }
    }
        
    useEffect(()=>{
        loadDataUser();
        //searchMyLinks();
    },[]);
    useEffect(()=>{
        searchMyLinks(user.user);
    },[page,pageSize])

    async function logOut(){
        await AsyncStorage.setItem('token','').then(()=>{
            navigate('Landing');
        }).catch(() => {
            Alert.alert("Erro ao deslogar! Tente novamente.")
        });
    }

    /*
    function testScrollPosition(e){
        if((e.layoutMeasurement.height + e.contentOffset.y) >=( e.contentSize.height)){
            //Final
            setScrollFlag(true);
            return true;
        }
        if(e.contentOffset.y == 0){
            //Começo
            setScrollFlag(false);
            return false;
        }
        
    }
    */
    function testEndScroll({layoutMeasurement, contentOffset, contentSize}){
        if((layoutMeasurement.height + contentOffset.y  + 10>=
        contentSize.height) && (!loading) && (count.link > myLinks.length)){
            setLoading(true);
            setPage(page + 1);
        }   
    }
    function MyLinks(){
        const [field, setField] = useState('');
        return(
            <ScrollView
            nestedScrollEnabled={true}
            contentContainerStyle={{backgroundColor:colors.cinzaMedio}}
            ref={refLink}
            //keyboardShouldPersistTaps='always'
            //scrollEnabled={scrollFlag}
            onScroll={(e)=>testEndScroll(e.nativeEvent)}
            style={{maxHeight:0.92*vh}}>
                <View style={{paddingVertical:10}}>
                    <FieldSearch
                    placeholder="Busca"
                    value={field}
                    setText={(t)=>setField(t)}
                    onSubmit={()=>onSearchLink(field)}
                    />
                    
                </View>
                <View style={styles.containerLinks}>
                    {//myLinks || null
                    myLinks || null
                    }
                </View>
                    {//loading ? <Text>Loading</Text> : null
                    }
            </ScrollView>
        );
    }
    function MyFavorites(){
        return(
            <ScrollView contentContainerStyle={{flex:1,backgroundColor:colors.cinzaMedio}}
            //keyboardShouldPersistTaps="always"

            >
                <View style={{paddingVertical:10}}>
                    <FieldSearch 
                    placeholder="Busca" 
                    value={fieldSearchMyFavorites} 
                    setText={(t)=>setFieldSearchMyFavorites(t)} 
                    onSubmit={(e)=>searchMyLinks()}
                    />
                </View>
            </ScrollView>
        );
    }
    function onSearchLink(text){
        if(text){
            setFieldSearchMyLinks(text);
        }
        setLoading(true);
        setMyLinks([]);
        setPage(0);
        if(page === 0){
            searchMyLinks(user.user,true);
        //searchMyLinks(user.user,true);
        }
        
    }
    return(<>
            {loading || !user.user ? <Loading/> : null }
        <SafeAreaView style={styles.container} >
            <ScrollView
            contentContainerStyle={{alignItems:'center'}}
            //keyboardShouldPersistTaps="always"
            //onScroll={(e)=>testScrollPosition(e.nativeEvent)}
            >
            
                <View style={styles.logOut}>
                    <RectButton onPress={()=>logOut()} style={styles.buttonLogOut}>
                        <Text style={styles.text} >Sair</Text>
                        <Feather name='log-out' size={40} color={colors.vermelho}/> 
                    </RectButton>
                </View>
                <Image source={{uri:user.photograph}} style={styles.imageProfile}/>
                <View style={styles.containerUser}>
                    <Text style={[styles.text,styles.textUser]}>@{user.user}</Text>
                    <RectButton onPress={()=>toEndScroll()}>
                        <Feather name='edit' size={25} color={colors.cinzaClaro}/> 
                    </RectButton>
                </View>
                <Text style={[styles.text,{fontSize:25}]}>{user.name}</Text>
                <View style={{width:vw}}>
                    <Tab.Navigator
                        tabBarOptions={{
                            labelStyle: { fontSize: 20 ,color:colors.cinzaClaro, textTransform:'none',fontFamily:'Righteous_400Regular',},
                            tabStyle: { width: vw/2},
                            style: { backgroundColor: colors.cinzaMedio},
                            indicatorStyle:{backgroundColor:colors.amarelo}
                        }}
                    >
                        <Tab.Screen name="MyLinks" options={{ tabBarLabel: 'Meus Links' }} component={MyLinks}/>
                        <Tab.Screen name="MyFavorites" options={{ tabBarLabel: 'Meus Favoritos' }} component={MyFavorites}/>
                    </Tab.Navigator>
                </View>
            </ScrollView>
        </SafeAreaView>
        </>
    );
}