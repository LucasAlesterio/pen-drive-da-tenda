import React,{useState} from 'react';
import {View, Alert} from 'react-native';
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

export default function Registration(){
    const [photo,setPhoto] = useState('');
    const [name,setName] = useState({value:'',error:false,textError:''});
    const [email,setEmail] = useState({value:'',error:false,textError:''});
    const [user,setUser] = useState({value:'',error:false,textError:''});
    const [password,setPassword] = useState({value:'',error:false,textError:''});
    const [confirmPass,setConfirmPass] = useState({value:'',error:false,textError:''});
    const [loading,setLoading] = useState(false);
    const {navigate} = useNavigation();

    async function saveToken(token){
        try{
            AsyncStorage.setItem('token',token)
        }catch(e){
            console.log(e)
            Alert.alert('Erro ao salvar token');
        }
    }

    async function cadastrar(){
        setLoading(true);
        if(!name.value){
            setName({value:"",error:true,textError:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(!email.value){
            setEmail({value:"",error:true,textError:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(!user.value){
            setUser({value:"",error:true,textError:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(!password.value){
            setPassword({value:"",error:true,textError:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(password.value.length < 8){
            setPassword({value:password.value,error:true,textError:"Necessário no minimo 8 caracteres"});
            setLoading(false);
            return null;
        }
        if(!confirmPass.value){
            setConfirmPass({value:"",error:true,textError:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(password.value !== confirmPass.value){
            setConfirmPass({value:confirmPass.value,error:true,textError:"Senhas não coincidem"});
            setLoading(false);
            return null;
        }
        await api.post('addUser',{
            name:name.value,
            email:email.value,
            password:password.value,
            user:user.value,
            photograph:photo
        }).then(function(response){
            if(response.data.error){
                if(response.data.email){
                    setEmail({value:email.value,error:true,textError:"Email ja cadastrado"});
                }
                if(response.data.user){
                    setUser({value:user.value,error:true,textError:"Usuário ja cadastrado"});
                }
                if(response.data.photo){
                    Alert.alert('Erro ao carregar a foto, tente novamente!');
                }
                setLoading(false);
                return null;
            }
            saveToken(response.data.token);
            setLoading(false);
            navigate('Tabs',{screen:'Search'});
        }).catch(function(error){
            console.log(error);
            setLoading(false);
            Alert.alert('Erro no servidor!');
        });
    }
    return(<>
        {loading ? <Loading/> : null }
        <SafeAreaView style={styles.container}>
        <View style={{width:'100%'}}><GoBack/></View>
        <View style={styles.container}>
            <InputImageUser setImg={setPhoto}/>
            <View style={styles.form}>
                <FieldText
                value={name.value}
                placeholder="Nome"
                setText={(text)=>setName({value:text,error:false,textError:''})}
                error = {name.error}
                textError={name.textError}
                >
                    <Feather name="user" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>

                <FieldText
                value={email.value}
                placeholder="Email"
                setText={(text)=>setEmail({value:text,error:false,textError:''})}
                error = {email.error}
                textError={email.textError}
                >
                    <Feather name="mail" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>

                <FieldText
                value={user.value}
                placeholder="Usuário"
                setText={(text)=>setUser({value:text,error:false,textError:''})}
                error = {user.error}
                textError={user.textError}
                >
                    <Feather name="at-sign" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>

                <FieldText
                value={password.value}
                placeholder="Senha"
                setText={(text)=>setPassword({value:text,error:false,textError:''})}
                password
                error = {password.error}
                textError={password.textError}
                >
                    <Feather name="key" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>

                <FieldText
                value={confirmPass.value}
                placeholder="Confirme sua senha"
                setText={(text)=>setConfirmPass({value:text,error:false,textError:''})}
                password
                error = {confirmPass.error}
                textError={confirmPass.textError}
                >
                    <Feather name="key" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>
                <Button style={styles.button}title="Cadastrar" onPress={()=>cadastrar()}/>
            </View>
        </View>
        </SafeAreaView>
        </>
    );
}