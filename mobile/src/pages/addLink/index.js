import React, { useState, useEffect } from 'react';
import styles from './styles';
import api from '../../service/api';
import colors from '../../global.json';
import Select from '../../components/Select';
import { Feather } from '@expo/vector-icons'; 
import Button from '../../components/button';
import FieldText from '../../components/fieldText';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import InputImageLink from '../../components/inputImageLink';
import Tags from '../../components/tags';
import Loading from '../../components/loading';

export default function AddLink(){
    const [name,setName] = useState({value:'',error:false,textError:''});
    const [link,setLink] = useState({value:'',error:false,textError:''});
    const [photo, setPhoto] = useState('');
    const [description,setDescription] = useState('');
    const [type,setType] = useState({value:'',error:false,textError:''});
    const [typeList,setTypeList] = useState([]);
    const [tags,setTags] = useState([]);
    const [fieldTag,setFieldTag] = useState('');
    const [loading,setLoading] = useState(false);
    const [list,setList] = useState();
    const { navigate } = useNavigation();

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
            alert('Erro no servidor');
        }
    }
    
    function setNewType(e){
        if(e !== type){
            setType({value:e,error:false,textError:''});
        }
    }

    useEffect(()=>{
        loadTypes();
    },[]);

    function addTag(){
        if(tags.indexOf(fieldTag) === -1 && fieldTag !== ""){
            setTags(tags.concat(fieldTag));
            setList(<Tags edit tags={tags.concat(fieldTag)} onDelete={(tag)=>deleteTag(tag)}/>);
        }
        setFieldTag('');
    }

    function deleteTag(tag){
        let listTags = tags;
        listTags.forEach((t,i)=>{
            if(t === tag){
                listTags.splice(i,1);
                return null;
            }
        });
        setTags(listTags);
        setList(<Tags edit tags={tags} onDelete={(tag)=>deleteTag(tag)}/>);
    }

    function jsonTags(){
        return(
            tags.map((a)=>{
                return({name:a})
            })
        );
    }
    async function add(){
        const token = await AsyncStorage.getItem('token');
        if(!name.value){
            setName({value:'',error:true,textError:'Campo obrigatório!'});
            return null;
        }
        if(!link.value){
            setLink({value:'',error:true,textError:'Campo obrigatório!'});
            return null;
        }
        if(!type.value){
            setType({value:'',error:true,textError:'Campo obrigatório!'})
        }
        if(token){
            setLoading(true);
            await api.post('/addLink',
            {
                name:name.value,
                type:{
                    name:type.value
                },
                description:description,
                link:link.value,
                tag:jsonTags(),
                photograph:photo
            },
            {headers:{Authorization:token}})
            .then((response)=>{
                if(response.data.erro){
                    if(response.data.token){
                        navigate('Landing');
                    }
                }else{
                    navigate('LinkProfile',{id:response.data.id});
                }
                setLoading(false);
            })
            .catch((error)=>{
                console.log(error);
                setLoading(false);
                Alert.alert('Erro no servidor!');
            })
        }

    }

    return(
        <SafeAreaView style={styles.container} edges={['right','left','top']}>
            {loading ? <Loading/> :null}
            <ScrollView contentContainerStyle={{alignItems:'center'}}>
                <Text style={styles.text}>Cadastro de Link</Text>
                <InputImageLink setImg={(img)=>setPhoto(img)}/>
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
                        value={type.value}
                        placeholder="Tipo"
                        valueDefault={null}
                        items={(typeList) || []}
                        error={type.error}
                        textError={type.textError}
                        />
                    </View>
                </View>
                <View style={styles.box}>
                    <TextInput
                    style={styles.description}
                    placeholder="Descrição"
                    placeholderTextColor = {colors.cinzaClaro+60}
                    multiline={true}
                    value={description}
                    onChangeText={(text)=>setDescription(text)}
                    numberOfLines={6}/>
                </View>
                <View style={[styles.box,{height:'auto'}]}>
                    <View style={styles.tag}>
                        <TextInput
                        style={styles.tagText}
                        placeholder="Tags"
                        placeholderTextColor={colors.cinzaClaro+60}
                        onSubmitEditing={()=>addTag()}
                        onChangeText={(text)=>setFieldTag(text)}
                        value={fieldTag}
                        />
                        <RectButton onPress={()=>addTag()}>
                            <Feather name="plus-circle" size={30} color="#C2C2C2" />
                        </RectButton>
                    </View>
                    {list}
                </View>
                <Button onPress={()=>add()} style={{marginVertical: 20}} title="Cadastrar"/>
            </ScrollView>
        </SafeAreaView>
    );
}