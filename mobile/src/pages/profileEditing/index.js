import React,{useState} from 'react';
import {View, Alert, Text} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import FieldText from '../../components/fieldText';
import Button from '../../components/button';
import api from '../../service/api';
import AsyncStorage from '@react-native-community/async-storage';
import InputImageUser from '../../components/InputImageUser';
import { Feather} from '@expo/vector-icons';
import colors from '../../global.json';
import GoBack from '../../components/goBack';
import Loading from '../../components/loading';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RectButton } from 'react-native-gesture-handler';

export default function ProfileEditing({route}){
    //console.log(route);
    const dataUser = route.params.user;
    const [photo,setPhoto] = useState(dataUser.photograph);
    const [name,setName] = useState({value:dataUser.name,error:false,textError:''});
    const [user,setUser] = useState({value:dataUser.user,error:false,textError:''});
    const [oldPassword,setOldPassword] = useState({value:'',error:false,textError:''});
    const [password,setPassword] = useState({value:'',error:false,textError:''});
    const [confirmPass,setConfirmPass] = useState({value:'',error:false,textError:''});
    const [loading,setLoading] = useState(false);
    const [open,setOpen] = useState(false);
    const { goBack, navigate } = useNavigation();

    async function updateData(){
        const token = await AsyncStorage.getItem('token');
        setLoading(true);
        var response = '';
        if(!name.value){
            setName({value:'',error:true,textError:'Campo obrigatório!'})
            setLoading(false);
            return null;
        }
        if(!user.value){
            setUser({value:'',error:true,textError:'Campo obrigatório!'})
            setLoading(false);
            return null;
        }
        try{
            response = await api.post('/updateProfile',{
                user:user.value,
                name:name.value,
                photograph:photo
            },{headers:{Authorization:token}});
            if(response.data.error){
                if(response.data.user){
                    setUser({value:user.value,error:true,textError:'Usuário já existe!'});
                    setLoading(false);
                    return null;
                }
            }
            if(open){
                if(!oldPassword.value){
                    setOldPassword({value:'',error:true,textError:'Campo obrigatório!'});
                    setLoading(false);
                    return null;
                }
                if(!password.value){
                    setPassword({value:'',error:true,textError:'Campo obrigatório!'});
                    setLoading(false);
                    return null;
                }
                if(password.value.length < 8){
                    setPassword({value:password.value,error:true,textError:'Senha curta!'});
                    setLoading(false);
                    return null;
                }
                if(!confirmarSenha.value){
                    setConfirmPass({value:'',error:true,textError:'Campo obrigatório!'});
                    setLoading(false);
                    return null;
                }
                if(senha.value !== confirmarSenha.value){
                    setConfirmPass({value:confirmPass.value,error:true,textError:'Senhas não coincidem!'});
                    setLoading(false);
                    return null;
                }
                try{
                    response = await api.post('/updatePassword',{
                        oldPassword:oldPassword.value,
                        newPassword:password.value
                    },{headers:{Authorization:token}});
                    if(response.data.error && response.data.password){
                        setOldPassword({value:'',error:true,textError:'Senha incorreta!'});
                        setLoading(false);
                        return null;
                    }
                }catch{
                    setLoading(false);
                    alert('Erro no seridor!');
                }
            }
            setOpen(false);
            setLoading(false);
            //goBack();
            navigate('Profile',{refresh:true});

        }catch{
            setLoading(false);
            Alert.alert('Erro no servidor!');
        }
        
    }
    return(<>
        <SafeAreaView style={styles.container} >
        {loading ? <Loading/> : null }
        <View style={{width:'100%', paddingBottom:40}}><GoBack/></View>
        
            <InputImageUser setImg={setPhoto} value={photo}/>
            <View style={styles.form}>
                <FieldText
                style={styles.input}
                value={name.value}
                placeholder="Nome"
                setText={(text)=>setName({value:text,error:false,textError:''})}
                error = {name.error}
                textError={name.textError}
                >
                    <Feather name="user" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>

                <FieldText
                style={styles.input}
                value={user.value}
                placeholder="Usuário"
                setText={(text)=>setUser({value:text,error:false,textError:''})}
                error = {user.error}
                textError={user.textError}
                >
                    <Feather name="at-sign" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>

                <RectButton onPress={()=>setOpen(!open)}><Text style={styles.text}>Alterar minha senha</Text></RectButton>

                {open ?
                <>
                <FieldText
                style={styles.input}
                value={oldPassword.value}
                placeholder="Senha"
                setText={(text)=>setPassword({value:text,error:false,textError:''})}
                password
                error = {oldPassword.error}
                textError={oldPassword.textError}
                >
                    <Feather name="key" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>

                <FieldText
                style={styles.input}
                value={password.value}
                placeholder="Nova senha"
                setText={(text)=>setPassword({value:text,error:false,textError:''})}
                password
                error = {password.error}
                textError={password.textError}
                >
                    <Feather name="key" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>

                <FieldText
                style={styles.input}
                value={confirmPass.value}
                placeholder="Confirme sua senha"
                setText={(text)=>setConfirmPass({value:text,error:false,textError:''})}
                password
                error = {confirmPass.error}
                textError={confirmPass.textError}
                >
                    <Feather name="key" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>
                </>
                :null}
                </View>
                <Button style={styles.button}title="Concluir" onPress={()=>updateData()}/>
        </SafeAreaView>
        </>
    );
}