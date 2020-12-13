import React, { useState, useEffect, useCallback } from 'react';
import styles from './styles';
import api from '../../service/api';
import colors from '../../global.json';
import Select from '../../components/Select';
import { Feather } from '@expo/vector-icons'; 
import Button from '../../components/button';
import GoBack from '../../components/goBack';
import FieldText from '../../components/fieldText';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Alert, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import InputImageLink from '../../components/inputImageLink';
import Loading from '../../components/loading';
import Tags from '../../components/tags';


export default function EditLink({route}){
    const [name,setName] = useState({value:route.params.name,error:false,textError:''});
    const [link,setLink] = useState({value:route.params.link,error:false,textError:''});
    const [photo, setPhoto] = useState(route.params.photo);
    const [typeList,setTypeList] = useState([]);
    const [description,setDescription] = useState(route.params.description);
    const [type,setType] = useState({value:route.params.type,error:false,textError:''});
    const [tags,setTags] = useState(route.params.tags);
    const [loading,setLoading] = useState(false);
    const [fieldTag,setFieldTag] = useState('');
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
    

    async function addTag(){
        if(tags.indexOf(fieldTag) === -1 && fieldTag !== ""){
            setTags(tags.concat(fieldTag));
            setFieldTag('');
        }
    };

    function deleteTag(tag){
        let bufferTag = [];
        tags.forEach((t,i)=>{
            if(t !== tag){
                bufferTag.push(tags[i]);
            }
        })
        setTags(bufferTag);
    }

    function jsonTags(){
        return(
            tags.map((a)=>{
                return({name:a})
            })
        );
    }
    async function update(){ 
        const token = await AsyncStorage.getItem('token');
        if(!name.value){
            setName({value:'',error:true,textError:'Campo obrigatório!'})
            return null;
        }
        if(!link.value){
            setLink({value:'',error:true,textError:'Campo obrigatório!'})
            return null;
        }
        if(type.value === "" || !type.value){
            setType({value:'',error:true,textError:'Campo obrigatório!'})
            return null;
        }
        setLoading(true)
        if(token){
            await api.post('/updateLink',
            {
                id:route.params.id,
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
                    navigate('LinkProfile',{id:route.params.id});
                }
            })
            .catch((error)=>{
                setLoading(false);
                Alert.alert('Erro no servidor');
            });
        }
    }
    return(
        <SafeAreaView style={styles.container} edges={['right','left','top']}>
            {name ?
            <>
            {loading ? <Loading/>:null}
            <KeyboardAvoidingView behavior="padding">
                <ScrollView contentContainerStyle={{alignItems:'center'}}>
                    <View style={{width:'100%',alignItems:'flex-start'}}><GoBack/></View>
                    <Text style={styles.text}>Edição de Link</Text>
                    <InputImageLink setImg={(img)=>setPhoto(img)} value={photo} />
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
                            error={type.error}
                            textError={type.textError}
                            valueDefault={null}
                            items={(typeList) || []}/>
                        </View>
                    </View>
                    <View style={styles.box}>
                        <TextInput
                        style={styles.description}
                        placeholder="Descrição"
                        placeholderTextColor = {colors.cinzaClaro+60}
                        multiline={true}
                        numberOfLines={6}
                        onChangeText={(text)=>setDescription(text)}
                        value={description}
                        />
                    </View>
                    <View style={[styles.box,{height:'auto'}]}>
                        <View style={styles.tag}>
                            <TextInput 
                            style={styles.tagText} 
                            placeholder="Tags"
                            placeholderTextColor={colors.cinzaClaro+60}
                            onSubmitEditing={addTag}
                            onChangeText={(text)=>setFieldTag(text)}
                            value={fieldTag}/>
                            <RectButton onPress={()=>addTag()}><Feather name="plus-circle" size={30} color="#C2C2C2" /></RectButton>
                        </View>
                        {<Tags tags={tags} edit onDelete={(tag)=>deleteTag(tag)}/>}

                    </View>
                    <Button onPress={()=>update()} style={{marginTop: 20,marginBottom:40}} title="Atualizar"/>
                </ScrollView>
            </KeyboardAvoidingView>
            </>
            :<Loading/>}
        </SafeAreaView>
    );
}