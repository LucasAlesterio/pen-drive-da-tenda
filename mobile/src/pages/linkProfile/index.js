import React, { useState, useEffect } from 'react';
import { View, Image, Text, ScrollView, Alert } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../service/api';
import styles from './styles';
import GoBack from '../../components/goBack';
import Loading from '../../components/loading';
import Stars from '../../components/stars';

export default function LinkProfile(){
    const [link,setLink] = useState('');
    const [user,setUser] = useState('');
    //const [id,setId] = useState([]);
    //const [tags,setTags] = useState([]);
    const [loading,setLoading] = useState(false);
    const { navigate } = useNavigation();

    async function getLink(){
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if(token){
            try{
                const response = await api.post('/dataLink',{id:id},{headers:{Authorization:token}});
                if(response.data.error){
                    if(response.data.token){
                        Alert.alert('Necessário logar novamente!');
                        navigate('Landing');
                    }
                    if(response.data.empty){
                        Alert.alert('Não encontramos este link!');
                    }
                }
                //const tag =  response.data.link.tag;
                //setTags(tag.map((a)=>{
                //    return(a.name);
                setLink(response.data.link);
                setUser(response.data.user);
                setLoading(false);
            }catch(e){
                setLoading(false);
                Alert.alert('Erro no servidor');
            }
            setLoading(false);
        }else{
            navigate('Landing');
        }
    };
    
    useEffect(()=>{getLink},[]);

    return(<>
        {loading ? <Loading/> :null}
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.top}>
                <GoBack/>
                <RectButton style={{marginTop:50}}><AntDesign name='hearto' size={40} color='#C2C2C2'/></RectButton>
            </View>
            <Text style={styles.title}>{link.name}</Text>
            <View style={styles.photo}>
                <Image style={styles.image} source={{uri:link.photograph}}/>
                <Stars size={30} average={4}/>
            </View>
            <View style={styles.buttons}>
                <RectButton style={styles.button}>
                    <Text style={styles.bTitle}>Copiar</Text>
                    <Feather name="copy" size={30} color="#151515" />
                </RectButton>
                <RectButton style={styles.button}>
                    <Text style={styles.bTitle}>Abrir</Text>
                    <Feather name='external-link' size={30} color='#151515'/>
                </RectButton>
            </View>
            <View style={styles.box}>
                <Text style={styles.description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Text>
            </View>
            <View style={styles.box}>
                <View style={styles.type}>
                    <Text style={styles.typeName}>
                        Filme
                    </Text>
                </View>
                <View style={styles.tag}>
                    <Text style={styles.tagName}>
                        dois cachorros no egito
                    </Text>
                </View>
                <View style={styles.tag}>
                    <Text style={styles.tagName}>
                        au au pras esfinges
                    </Text>
                </View>
                    
            </View>
            </ScrollView>
        </View>
    </>);
}