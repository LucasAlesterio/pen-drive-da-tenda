import React,{useState} from 'react';
import { View, Alert} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import FieldText from '../../components/fieldText';
import Button from '../../components/button';
import api from '../../service/api';
import AsyncStorage from '@react-native-community/async-storage';
import GoBack from '../../components/goBack';
import Loading from '../../components/loading';
import { Feather} from '@expo/vector-icons';
import colors from '../../global.json';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login(){
    const [email,setEmail] = useState({value:'',error:false,textError:''});
    const [password,setPassword] = useState({value:'',error:false,textError:''});
    const [loading, setLoading] = useState(false);
    const { navigate} = useNavigation();

    async function saveToken(token){
        try{
            AsyncStorage.setItem('token',token)
        }catch(e){
            console.log(e)
            Alert.alert('Erro ao salvar token');
        }
    }
    function testError(response){
        if(response.data.error){
            if(response.data.password){
                setPassword({value:password.value,error:true,textError:"Senha incorreta"});
                setLoading(false);
                return true;
            }
            if(response.data.email){
                setEmail({value:email.value,error:true,textError:"Email inválido"});
                setLoading(false);
                return true;
            }
            if(response.data.user){ 
                setEmail({value:email.value,error:true,textError:"Usuário inválido"});
                setLoading(false);
                return true;
                
            }
        }
        return false;
    }
    function redirect(response){
        if(response.data.token){
            saveToken(response.data.token);
            setLoading(false);
            navigate('Tabs',{screen:'Search'});
        }else{
            Alert.alert('Erro ao logar, por favor tente novamente!');
        }
    }

    async function logar(){
        setLoading(true);
        var isEmail = false;
        if(!email.value){
            setEmail({value:"",error:true,textError:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(!password.value){
            setPassword({value:"",error:true,textError:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        var letras = email.value.split('');
        var text = '';
        letras.forEach((letra)=>{
            if(letra === '@'){
                isEmail = true;
            }
            text += letra;
        })
        if(isEmail){
            await api.post('login',{
                email:text,
                password:password.value
            }).then(async(response)=>{
                if(testError(response)){
                    return null;
                }
                await api.get('/refreshToken',{ headers:{Authorization:response.data.token}})
                .then(async (response)=>{
                    await AsyncStorage.setItem('token',response.data.token);
                    await AsyncStorage.setItem('user',response.data.user);
                    await AsyncStorage.setItem('mini',response.data.mini);
                    redirect(response);
                })
                .catch((error)=>{
                    console.log(error);
                })
                //redirect(response);
            }).catch(function(error){
                console.log(error);
                Alert.alert('Erro no servidor!');
                return null;
            });
        }else{
            await api.post('login',{
                user:text,
                password:password.value
            }).then(async (response)=>{
                if(testError(response)){
                    return null;
                }
                await api.get('/refreshToken',{ headers:{Authorization:response.data.token}})
                .then(async (response)=>{
                    await AsyncStorage.setItem('token',response.data.token);
                    await AsyncStorage.setItem('user',response.data.user);
                    redirect(response);
                })
                .catch((error)=>{
                    console.log(error);
                })
                //redirect(response);
            }).catch((error)=>{
                console.log(error);
                Alert.alert('Server error');
                return null;
            });
    }
}

    return(
    <>
        {loading ? <Loading/> : null}
        <SafeAreaView style={styles.container}>
        <View style={{width:'100%'}}><GoBack/></View>
        <View style={styles.container}>
            <View style={styles.form}>
                <FieldText
                value={email.value}
                placeholder="Email ou usuário"
                setText={(text)=>setEmail({value:text,error:false,textError:''})}
                error = {email.error}
                textError={email.textError}
                onSubmit={()=>logar()}
                >
                    <Feather name="user" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>

                <FieldText
                value={password.value}
                placeholder="Senha"
                setText={(text)=>setPassword({value:text,error:false,textError:''})}
                password
                error = {password.error}
                textError={password.textError}
                onSubmit={()=>logar()}
                >
                    <Feather name="key" size={20} color={`${colors.cinzaMedio}70`}/>
                </FieldText>

                <Button
                style={{width:150}}
                onPress={()=>logar()}
                title='Logar'
                />
            </View>
        </View>
        </SafeAreaView>
        </>
    );
}