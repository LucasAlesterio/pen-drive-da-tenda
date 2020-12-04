import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import Button from '../../components/button';
import { SafeAreaView } from 'react-native-safe-area-context';


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
        <SafeAreaView style={styles.container} edges={['right','left','top']}>
            <View style={styles.containerButton}>
                <Button
                onPress={navigateToSearch}
                title='Logar'/>
                <Button
                onPress={navigateToRegistration}
                title='Cadastrar'/>
            </View>
        </SafeAreaView>
    );
}