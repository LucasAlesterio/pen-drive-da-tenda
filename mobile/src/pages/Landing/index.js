import React, { useState, useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
//import { useNavigation } from '@react-navigation/bottom-tabs';
//import api from '../../services/api';
import styles from './styles';
import Button from '../../components/button';

export default function Landing(){
    const { navigate } = useNavigation();
    function navigateToSearch(){
        //navigate('Tabs',{screen:'Search'});
        navigate('Login');
    }
    return(
        <View style={styles.container}>
            <View style={styles.containerButton}>
                <Button
                onPress={navigateToSearch}
                title='Logar'/>
                <Button
                onPress={navigateToSearch}
                title='Cadastrar'/>
            </View>
        </View>
    );
}