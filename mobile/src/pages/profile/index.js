import React, {useState, useEffect, useRef} from 'react';
import styles from './styles';
import MyLinks from './myLinks';
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
    let refLink = useRef(null);
    const insets = useSafeAreaInsets();

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
                //searchMyLinks(response.data.user)
            }).catch((error)=>{
                console.log(error);
                Alert.alert("Erro no servidor!")
            });
        }else{
            navigate('Landing');
        }
    }

        
    useEffect(()=>{
        loadDataUser();
    },[]);

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

    return(<>
            {loading || !user.user ? <Loading/> : null }
        <SafeAreaView style={styles.container} >
            <ScrollView
            //ref={refLink}
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
                    <RectButton onPress={()=>refLink.scrollToEnd({duration: 500})}>
                        <Feather name='edit' size={25} color={colors.cinzaClaro}/> 
                    </RectButton>
                </View>
                <Text style={[styles.text,{fontSize:25}]}>{user.name}</Text>
                <View style={{width:vw,paddingTop:20}}>
                    <Tab.Navigator
                        tabBarOptions={{
                            labelStyle: { fontSize: 20 ,color:colors.cinzaClaro, textTransform:'none',fontFamily:'Righteous_400Regular',},
                            tabStyle: { width: vw/2},
                            style: { backgroundColor: colors.cinzaMedio},
                            indicatorStyle:{backgroundColor:colors.amarelo}
                        }}
                    >
                        <Tab.Screen name="MyLinks" options={{ tabBarLabel: 'Meus Links' }} initialParams={user.user} component={MyLinks}/>
                        <Tab.Screen name="MyFavorites" options={{ tabBarLabel: 'Meus Favoritos' }} component={MyFavorites}/>
                    </Tab.Navigator>
                </View>
            </ScrollView>
        </SafeAreaView>
        </>
    );
}