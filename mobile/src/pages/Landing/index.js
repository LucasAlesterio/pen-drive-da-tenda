import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import Button from '../../components/button';

export default function Landing(){
    const { navigate } = useNavigation();
    function navigateToSearch(){
        //navigate('Tabs',{screen:'Search'});
        navigate('Login');
    }
    function navigateToRegistration(){
        navigate('Registration');
    }
    return(
        <View style={styles.container}>
            <View style={styles.containerButton}>
                <Button
                onPress={navigateToSearch}
                title='Logar'/>
                <Button
                onPress={navigateToRegistration}
                title='Cadastrar'/>
            </View>
        </View>
    );
}