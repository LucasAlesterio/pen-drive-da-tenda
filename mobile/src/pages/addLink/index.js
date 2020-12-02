import React, { useState, useEffect } from 'react';
import styles from './styles';
//import api from '../../services/api';
import { Feather } from '@expo/vector-icons'; 
import { View, Image, Text, TextInput } from 'react-native';
import FieldText from '../../components/fieldText';
import Select from '../../components/Select';
import Button from '../../components/button';
import { useNavigation } from '@react-navigation/native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../global.json';
import { Colors } from 'react-native/Libraries/NewAppScreen';


export default function AddLink(){
    const [name,setName] = useState({value:'',error:false,textError:''});
    const [link,setLink] = useState({value:'',error:false,textError:''});
    const [type,setType] = useState('');
    const [typeList,setTypeList] = useState([]);
    const [links,setLinks] = useState([]);

    async function loadTypes(){
        try{
            const token = await AsyncStorage.getItem('token');
            const response = await api.get('/types',{headers:{Authorization:token}});
            if(response.data){
                setTypeList(response.data.types);
                if(response.data.error){
                    if(response.data.token){
                        Alert.alert('Necessário logar novamente!')
                        navigate('Landing');
                        return null;
                    }
                }
            }
        }catch{
            //alert('Erro no servidor');
        }
    };
    
    function setNewType(e){
        if(e !== type){
            setType(e);
        }
    };

    useEffect(()=>{
        loadTypes();
    },[]);

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{alignItems:'center'}}
            >
                <Text style={styles.text}>Cadastro de Link</Text>
                <RectButton style={styles.photo}>
                    <Feather name="camera" size={30} color="#FFEB0A"/>
                </RectButton>
                <View style={styles.infos}>
                    <FieldText
                    value={name.value}
                    placeholder="Nome"
                    setText={(text)=>setName({value:text,error:false,textError:''})}
                    error = {name.error}
                    textError={name.textError}
                    />
                    <FieldText
                    value={link.value}
                    placeholder="Link"
                    setText={(text)=>setLink({value:text,error:false,textError:''})}
                    error = {link.error}
                    textError={link.textError}
                    />
                    <View style={{width:'90%'}}>
                        <Select
                        type
                        setValue={(v)=>setNewType(v)}
                        value={type}
                        placeholder="Tipo"
                        valueDefault={null}
                        items={(typeList) || []}/>
                    </View>
                </View>
                <View style={styles.box}>
                    <TextInput
                    style={styles.description}
                    placeholder="Descrição"
                    placeholderTextColor = {colors.cinzaClaro+50}
                    multiline={true}
                    numberOfLines={6}/>
                </View>
                <View style={styles.box}>
                    <View style={styles.tag}>
                        <TextInput style={styles.text}/>
                    </View>
                </View>
                <Button style={{marginVertical: 20}} title="Cadastrar"/>
            </ScrollView>
        </SafeAreaView>
    );
}