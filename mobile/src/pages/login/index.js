import React,{useState} from 'react';
import { View, Alert } from 'react-native';
import styles from './styles';
import FieldText from '../../components/fieldText';
import Button from '../../components/button';

export default function Login(){
    const [email,setEmail] = useState({value:'',error:false,textError:''});
    const [password,setPassword] = useState({value:'',error:false,textError:''});

    async function logar(){
        Alert.alert('logar');
    }
    return(
        <View style={styles.container}>
            <View style={styles.form}>
                <FieldText
                value={email.value}
                placeholder="Email"
                setText={(text)=>setEmail({value:text,error:false,textError:''})}
                />
                <FieldText
                value={password.value}
                placeholder="Senha"
                setText={(text)=>setPassword({value:text,error:false,textError:''})}
                password
                />
                <Button
                onPress={logar}
                title='Logar'
                />
            </View>
        </View>
    );
}