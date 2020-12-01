import React, { useState, useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
//import api from '../../services/api';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TimeLine(){

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.text} >Time Line</Text>
        </SafeAreaView>
    );
}