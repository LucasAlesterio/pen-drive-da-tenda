import React,{useState} from 'react';
import { View, Alert, Text,Image} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import FieldText from '../../components/fieldText';
import Button from '../../components/button';
import api from '../../service/api';
import { AntDesign } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import axios from  'axios';


export default function Login(){
    const [email,setEmail] = useState({value:'',error:false,textError:''});
    const [password,setPassword] = useState({value:'',error:false,textError:''});
    const { navigate,goBack} = useNavigation();
    const [image,setImage] = useState('');

    async function logar(){
        await api.post('/login',{
            user:'lucas.alesterio',
            password:'220199'
        }).then(((response)=>
        {   //navigate('Tabs',{screen:'Search'});
            setImage(response.data.token);
        })).catch((error)=>{
            console.log(error);
            Alert.alert('error')})

        //setLoading(true);
        //var response = '';
        /*
        var isEmail = false;
        if(!email.value){
            setEmail({value:"",error:true,textError:"Campo obrigatório"});
            //setLoading(false);
            return null;
        }
        if(!password.value){
            setPassword({value:"",error:true,textError:"Campo obrigatório"});
            //setLoading(false);
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
        //console.log(a);
        if(isEmail){
            await api.post('login',{
                email:text,
                password:password.value
            }).then(function(response){
                if(response.data.error){
                    if(response.data.email){
                        setEmail({value:infoLogin.value,error:true,textError:"Email inválido"});
                        
                    }
                    if(response.data.user){ 
                        setEmail({value:infoLogin.value,error:true,textError:"Usuário inválido"});
                        
                    }
                    if(response.data.password){
                        setPassword({value:usuario.value,error:true,textError:"Senha incorreta"});
                    }
                    return null;
                }
            }).catch(function(error){
                Alert.alert('Erro no servidor!(Nesse aqui)');
                return null;
            });
        }else{
            await api.post('login',{
                user:text,
                password:password.value
            }).then((response)=>{
                if(response.data.error){
                    if(response.data.email){
                        setEmail({value:infoLogin.value,error:true,textError:"Email inválido"});
                    }
                    if(response.data.user){
                        setEmail({value:infoLogin.value,error:true,textError:"Usuário inválido"});
                    }
                    if(response.data.password){
                        setPassword({value:usuario.value,error:true,textError:"Senha incorreta"});
                    }
                    //etLoading(false);
                    return null;
                }
                if(response.token){
                    navigate('Tabs',{screen:'Search'});
                }
            }).catch((error)=>{
                Alert.alert('error');
                return null;
            });
                //setLoading(false);
                //return null;
            }
        //localStorage.setItem('token', );
        //setOpenLogin(false);
        //navigate('Tabs',{screen:'Search'});
        */
    }

    return(
    <>
        <Text>{image}</Text>
        <View style={{backgroundColor:'#151515'}}>
            <RectButton style={styles.voltar} onPress={()=>goBack()}>
                <AntDesign name="left" size={18} color="#C2C2C2"/>
                <Text style={styles.textVoltar}>Voltar</Text>
            </RectButton>
        </View>
        <View style={styles.container}>
            <View style={styles.form}>
                <FieldText
                value={email.value}
                placeholder="Email"
                setText={(text)=>setEmail({value:text,error:false,textError:''})}
                error = {email.error}
                textError={email.textError}
                />
                <FieldText
                value={password.value}
                placeholder="Senha"
                setText={(text)=>setPassword({value:text,error:false,textError:''})}
                password
                error = {password.error}
                textError={password.textError}
                />
                <Button
                onPress={()=>logar()}
                title='Logar'
                />
            </View>
        </View>
        </>
    );
}