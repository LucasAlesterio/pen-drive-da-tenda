import React from 'react';
import { View, Text,Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Stars from '../../components/stars';
import colors from '../../global.json';

export default function Link(props){
    const { navigate } = useNavigation();
    const styles = StyleSheet.create({
        button:{
            width:'40%',
            minWidth:'40%',
            paddingVertical:5,
            backgroundColor:`${colors.cinzaClaro}20`,
            alignItems:'center',
            marginHorizontal:5,
            marginVertical:10,
        },
        containerInfos:{
            alignItems:'center',
            flex: 1,
            justifyContent: 'flex-end',
        },   
        image:{
            width:'95%',
            height: props.vw*0.5
        },
        imageNone:{
            backgroundColor:colors.rosa,
            width:'95%',
            flex:1
        },  
        text:{
            color:'#C2C2C2',
            textAlign:'center',
            padding:7,
            fontFamily:'Roboto_400Regular',
        }
    })
    return(
        <RectButton style={styles.button} onPress={()=>navigate('LinkProfile',{id:props.id,idUser:props.idUser})}>
            <View style={{minHeight:(props.vw*0.5),width:'100%',justifyContent:'center',alignItems:'center'}}>
                {props.image ? <Image source={{uri:props.image||null}} style={styles.image}/>:
                <View style={styles.imageNone}/>}
            </View>
            <View style={styles.containerInfos}>
                <Text style={styles.text}>{props.title}</Text>
                <Stars size={20} average={props.average}/>
            </View>
        </RectButton>
    );
}