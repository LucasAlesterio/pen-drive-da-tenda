import React from 'react';
import { Image, StyleSheet, View, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../global.json';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import Stars from '../stars';

export default function LinkTimeLine({imageLink,imageUser,id,average,user,title}){
    const { navigate } = useNavigation();
    const vw = Dimensions.get('window').width;
    const styles = StyleSheet.create({
        container:{
            borderWidth:1,
            borderColor:colors.amarelo,
            width:0.9*vw,
            backgroundColor:colors.cinzaClaro+10,
            height:0.65*vw,
        },
        buttonContainer:{
            flex:1,
            flexDirection:'row',
        },
        imageLink:{
            maxHeight:0.65*vw,
            width:0.4*vw,
            resizeMode:'contain',
        },
        infos:{
            padding:10,
            justifyContent:'space-between',
            width:0.5*vw,
        },
        text:{
            fontFamily: 'Righteous_400Regular',
            color: colors.amarelo,
            fontSize: 20,
            marginBottom:10,
        },
        buttonUser:{
            height:50,
            width:50,
            alignSelf:'flex-end',
        },
        imageUser:{
            flex:1,
            borderRadius:25,
        }
    });

    return(
        <View style={styles.container}>
            <RectButton style={styles.buttonContainer} onPress={()=>navigate('LinkProfile',{id:id})}>
                <Image source={{uri:imageLink}} style={styles.imageLink}/>
                <View style={styles.infos}>
                    <View style={styles.name}>
                        <Text style={styles.text}>{title}</Text>
                        <Stars average={average} size={25}/>
                    </View>
                    <TouchableOpacity style={styles.buttonUser} 
                    onPress={()=>navigate('AnotherProfile',{idUser:user})}>
                        <Image source={{uri:imageUser}} style={styles.imageUser}/>
                    </TouchableOpacity>
                </View>
            </RectButton>
        </View>
    );
}
