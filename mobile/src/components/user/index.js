import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../../service/api';
import colors from '../../global.json';

export default function User({user,photo,isFriend,id,onChange,idUser}){
    const { navigate } = useNavigation();

    async function updateFriend(){
        if(idUser === user ){
            Alert.alert('Você não pode se seguir ;)');
            return null;
        }
        const token = await AsyncStorage.getItem('token');
        if(token){
            await api.post('/updateFriend',{
                friend:id
            },{headers:{Authorization:token}})
            .then(()=>{
                onChange();
            })
            .catch((error)=>{
                console.log(error);
                Alert.alert('Erro no servidor, tente novamente!');
            });
        }else{
            navigate('Landing');
        }
    }
    return(
        <View style={styles.container}>
            <RectButton onPress={()=>navigate('AnotherProfile',{idUser:user})} >
                {photo ?
                <Image source={{uri:photo}} style={styles.image}/>
                :<View style={[styles.image,{backgroundColor:colors.rosa}]}/>}
            </RectButton>
            <View style={styles.info}>
                <Text style={styles.textUser}>@{user}</Text> 
                <RectButton onPress={()=>updateFriend()} style={styles.button}>
                    <Text style={styles.textButton}>{isFriend ? "Deixar de seguir" : "Seguir"}</Text>
                </RectButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        padding:15,
    },  
    image:{
        height:80,
        width:80,
        borderRadius:40,
        borderWidth:2,
        borderColor:colors.amarelo,
    },
    textUser:{
        color:colors.amarelo,
        fontSize:20,
        fontFamily:'Righteous_400Regular'
    },
    info:{
        height:80,
        paddingLeft:10,
        justifyContent:'center'
    },
    button:{
        backgroundColor:colors.amarelo,
        borderRadius:5,
        paddingHorizontal:5,
        alignSelf:'flex-start'
    },
    textButton:{
        color:colors.cinzaMedio,
        fontSize:16,
        fontFamily:'Righteous_400Regular',
    }

});