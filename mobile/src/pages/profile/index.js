import React, {useState, useCallback} from 'react';
import styles from './styles';
import MyLinks from './myLinks';
import api from '../../service/api';
import colors from '../../global.json';
import MyFavorites from './myFavorites';
import { Feather } from '@expo/vector-icons';
import Loading from '../../components/loading';
import { RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import { View, Image, Text, Alert, ScrollView, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

export default function Profile(){
    const Tab = createMaterialTopTabNavigator();
    const vw = Dimensions.get('window').width;
    const [user,setUser] = useState({});
    const { navigate, goBack } = useNavigation();


    useFocusEffect( useCallback(()=>{
        loadDataUser();
    },[]));

    async function loadDataUser(){
        const token = await AsyncStorage.getItem('token');
        const idUser = await AsyncStorage.getItem('user');
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

    async function logOut(){
        await AsyncStorage.clear().then(()=>{
            navigate('Landing');
        }).catch(() => {
            Alert.alert("Erro ao deslogar! Tente novamente.")
        });
    }

    return(<>
        {!user.user ? <Loading/> : null }
        <SafeAreaView style={styles.container} edges={['right', 'top', 'left']}>
            <ScrollView
            stickyHeaderIndices={[4]}
            contentContainerStyle={{alignItems:'center',backgroundColor:colors.cinzaMedio}}
            style={{backgroundColor:colors.cinzaMedio}}
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
                    <RectButton onPress={()=>navigate('ProfileEditing',{user:user})}>
                        <Feather name='edit' size={25} color={colors.cinzaClaro}/>
                    </RectButton>
                </View>
                <Text style={[styles.text,{fontSize:25}]}>{user.name}</Text>
                <View style={{width:vw,paddingTop:20,backgroundColor:colors.cinzaMedio}}>
                    {user.user ?
                    <Tab.Navigator
                        style={{backgroundColor:colors.cinzaMedio}}
                        tabBarOptions={{
                            labelStyle: { fontSize: 20 ,color:colors.cinzaClaro, textTransform:'none',fontFamily:'Righteous_400Regular',},
                            tabStyle: { width: vw/2},
                            style: { backgroundColor: colors.cinzaMedio},
                            indicatorStyle:{backgroundColor:colors.amarelo}
                        }}
                        
                    >
                        <Tab.Screen name="MyLinks" options={{ tabBarLabel: 'Meus Links' }} initialParams={{user:(user.user)}} component={MyLinks}/>
                        <Tab.Screen name="MyFavorites" options={{ tabBarLabel: 'Meus Favoritos' }} component={MyFavorites}/>
                    </Tab.Navigator>
                    :null}
                </View>
            </ScrollView>
        </SafeAreaView>
        </>
    );
}