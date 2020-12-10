import React,{useState} from 'react';
import {View,Text,TouchableOpacity, Alert, StyleSheet} from 'react-native';
import api from '../../service/api';
import MiniLoading from '../miniLoading';
import PopUpBox from '../popUpBox';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../../global.json';

export default function PopRating({open,onClose,title,id,newAverage}){
    const [loading,setLoading] = useState(false);
    const [nStars,setNStars] = useState(0);

    async function rating(){
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if(token){
            await api.post('/rating',{stars:nStars,link:id},{headers:{Authorization:token}})
            .then((response)=>{
                newAverage(response.data.average);
                setLoading(false)
                onClose();
            })
            .catch((error)=>{
                console.log(error);
                setLoading(false);
                Alert.alert('Erro ao avaliar, tente novamente!');
                onClose();
            });
        }
    }

    return(
        <PopUpBox open={open} onClose={(state)=>onClose(state)} title={title}>
            {!loading ? <>
                <View style={styles.container}>
                    <View style={styles.stars}>
                        <TouchableOpacity onPress={()=>setNStars(1)}>
                            <FontAwesome name={nStars >= 1 ? "star": "star-o"} size={40} color={colors.amarelo}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setNStars(2)}>
                            <FontAwesome name={nStars >= 2 ? "star": "star-o"} size={40} color={colors.amarelo}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setNStars(3)}>
                            <FontAwesome name={nStars >= 3 ? "star": "star-o"} size={40} color={colors.amarelo}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setNStars(4)}>
                            <FontAwesome name={nStars >= 4 ? "star": "star-o"} size={40} color={colors.amarelo}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setNStars(5)}>
                            <FontAwesome name={nStars >= 5 ? "star": "star-o"} size={40} color={colors.amarelo}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.popButton} onPress={()=>rating()}>
                        <Text style={styles.text}>Enviar</Text>
                    </TouchableOpacity>
                </View>
                </>:<MiniLoading/>}
            </PopUpBox>
    );
}
const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        justifyContent:'space-around',
        height:150
    },
    stars:{
        flexDirection:'row'
    },
    popButton:{
        justifyContent:'center',
        
        backgroundColor:colors.amarelo,
        borderRadius:5,
        paddingHorizontal:20,
        paddingVertical:10,
    },
    text:{
        color:colors.cinzaMedio,
        fontFamily:'Righteous_400Regular',
        fontSize:20,
    }
});