import React,{useState} from 'react';
import { View, Alert, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import colors from '../../global.json';
import { RectButton } from 'react-native-gesture-handler';
export default function GoBack(){
    const { goBack} = useNavigation();
    const styles = StyleSheet.create({
    voltar:{
        backgroundColor:'#151515',
        marginTop: 50,
        paddingLeft: 7,
        flexDirection: 'row',
        width: 83,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    textVoltar:{
        color: colors.cinzaClaro,
        fontSize: 17
    }
});
    return(
        <View style={{backgroundColor:'#151515'}}>
        <RectButton style={styles.voltar} onPress={()=>goBack()}>
            <AntDesign name="left" size={18} color="#C2C2C2"/>
            <Text style={styles.textVoltar}>Voltar</Text>
        </RectButton>
        </View>
    );
}

