import React,{useState, useEffect} from 'react';
import { Image, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import TimeLine from '../pages/timeLine';
import Friends from '../pages/friends';
import AddLink from '../pages/addLink';
import Search from '../pages/search';
import Profile from '../pages/profile';
import colors from '../global.json'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from '../service/api';

const { Navigator, Screen } = createBottomTabNavigator();

export default function Tabs(){
    const { navigate } = useNavigation();
    const [dataUser,setDataUser] = useState({});
    useEffect(()=>{
        async function testeToken(){
        const token = await AsyncStorage.getItem('token');
        if(token){
                var response = '';
                try{
                    response = await api.get('/refreshToken',{ headers:{Authorization:token}});
                    setDataUser(response.data);
                    AsyncStorage.setItem('token',response.data.token);
                    if(response.data){
                    if(response.data.error){
                        navigate("Landing");
                    }
                }
                }catch{
                    alert('Error servidor');
                }
            }else{
                navigate("Landing");
            }
        }
        testeToken();
    },[]);
    return (<SafeAreaProvider style={{flex:1, backgroundColor:colors.cinzaMedio}}>
        <Navigator
        initialRouteName="Search"
        tabBarOptions={{
        style: {
            elevation: 0,
            shadowOpacity: 0,
            border:'none',
            backgroundColor: colors.cinzaEscuro,
            borderTopWidth:0,
        },
        tabStyle: {
            height: 65,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            border:'none',
            height:'100%'
        },
        iconStyle: {
            flex: 0,
            justifyContent:'center',
            width:'100%'
        },
        }}
    >
        <Screen 
        name="TimeLine" 
        component={TimeLine}
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size, focused }) => {
            return (
                <Feather name="home" size={size} color={focused ? '#FFEB0A' : color} />
            );
            }
        }}
        />

        <Screen 
        name="Friends" 
        component={Friends}
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size, focused }) => {
            return (
                <Feather name="users" size={size} color={focused ? '#FFEB0A' : color} />
            );
            }
        }}
        />
        
        <Screen 
        name="AddLink" 
        component={AddLink}
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size, focused }) => {
            return (
                <Feather name="file-plus" size={size} color={focused ? '#FFEB0A' : color} />
            );
            }
        }}
        />

        <Screen 
        name="Search" 
        component={Search}
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size, focused }) => {
            return (
                <Feather name="search" size={size} color={focused ? '#FFEB0A' : color} />
            );
            }
        }}
        />

        <Screen 
        name="Profile" 
        children={()=><Profile idUser={dataUser.user}/>}
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size, focused }) => {
            return (
                dataUser.photograph ? 
                <Image source={{uri:dataUser.photograph}} 
                style={[{width:27,height:27,borderRadius:50},focused && {borderWidth:1,borderColor:colors.amarelo}]}/>
                :<View style={[{width:27,height:27,borderRadius:50,backgroundColor:colors.rosa},focused && {borderWidth:1,borderColor:colors.amarelo}]}/>
            );
            }
        }}
        >
        </Screen>
    </Navigator>
    </SafeAreaProvider>
    );
}

/*
import { Feather } from '@expo/vector-icons'; 
<Feather name="instagram" size={24} color="C2C2C2" />

**Feather**
instagram
facebook
twitter
home
user-plus
user-check
user
users
edit
log-out
file-plus
search
plus-circle
x
plus
camera
copy
mail
at-sign
key

**AntDesign**
heart (preenchido)
hearto (vazio)
link
left (botão de voltar)

**FontAwesome**
star
star-o
star-half-o
*/